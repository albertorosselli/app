/**
 * Google/Maps visibility quick-check workflow for "Gratis Google-sjekk".
 *
 * This module is designed to be run server-side (Node) or in a trusted worker.
 * It does **not** scrape Google directly here; instead it defines adapter
 * interfaces so you can plug in:
 *   - a search runner (headless/incognito or API-backed),
 *   - a Google Business Profile fetcher (API or manual capture),
 *   - a lightweight site auditor (real fetch or human checkbox mode).
 *
 * The core logic is deterministic, fast, and returns structured JSON plus
 * rule-based suggestions.
 */

// ---------- Types ----------

export type AuditInput = {
  businessName: string
  location: string
  serviceType: string
  businessId?: string
  websiteUrl?: string
}

export type SearchPresence = {
  query: string
  foundInLocalPack: boolean
  organicPresence: boolean
  mapSnippet: boolean
}

export type GBPProfile = {
  primaryCategory?: string
  isVerified: boolean
  phonePresent: boolean
  websiteLinked: boolean
  hoursValid: boolean
  descriptionExists: boolean
  photos: boolean
  reviewCount: number
  rating: number | null
}

export type WebsiteAudit = {
  heroPhoneVisible: boolean
  heroServiceStatement: boolean
  loadsFastMs: number | null
}

export type AuditResult = {
  presence: {
    localPack: boolean
    organic: boolean
  }
  gbp: GBPProfile | { unavailable: true; reason: string }
  websiteAudit: WebsiteAudit | { unavailable: true; reason: string }
  suggestions: string[]
  rawSearch: SearchPresence[]
}

// ---------- Adapter contracts ----------

export interface SearchAdapter {
  runIncognitoSearch(query: string): Promise<SearchPresence>
}

export interface GBPAdapter {
  fetchProfile(input: {
    businessId?: string
    businessName: string
    location: string
    searchResults?: SearchPresence[]
  }): Promise<GBPProfile | { unavailable: true; reason: string }>
}

export interface SiteAuditAdapter {
  auditSite(url?: string): Promise<WebsiteAudit | { unavailable: true; reason: string }>
}

export type AuditAdapters = {
  search: SearchAdapter
  gbp: GBPAdapter
  site: SiteAuditAdapter
}

// ---------- Default "manual" adapters ----------

/**
 * Default adapters are lightweight placeholders that return
 * "unavailable" so a human can tick fields in a UI instead.
 * Replace these with real implementations when wiring up automation.
 */
export const defaultAdapters: AuditAdapters = {
  search: {
    async runIncognitoSearch(query) {
      return {
        query,
        foundInLocalPack: false,
        organicPresence: false,
        mapSnippet: false,
      }
    },
  },
  gbp: {
    async fetchProfile() {
      return { unavailable: true, reason: 'GBP adapter not configured' }
    },
  },
  site: {
    async auditSite() {
      return { unavailable: true, reason: 'Site audit adapter not configured' }
    },
  },
}

// ---------- Core audit ----------

export async function runAudit(input: AuditInput, adapters: AuditAdapters = defaultAdapters): Promise<AuditResult> {
  const queries = normalizeQueries(input)

  // Step 2: SERP presence
  const searchResults: SearchPresence[] = []
  for (const q of queries) {
    const res = await adapters.search.runIncognitoSearch(q)
    searchResults.push(res)
  }

  const localPack = searchResults.some(r => r.foundInLocalPack)
  const organic = searchResults.some(r => r.organicPresence)

  // Step 3: GBP audit
  const gbpProfile = await adapters.gbp.fetchProfile({
    businessId: input.businessId,
    businessName: input.businessName,
    location: input.location,
    searchResults,
  })

  // Step 4: Website audit
  const siteAudit = await adapters.site.auditSite(input.websiteUrl)

  // Step 6: Suggestions
  const suggestions = buildSuggestions(gbpProfile, siteAudit, localPack)

  return {
    presence: { localPack, organic },
    gbp: gbpProfile,
    websiteAudit: siteAudit,
    suggestions,
    rawSearch: searchResults,
  }
}

// ---------- Helpers ----------

function normalizeQueries(input: AuditInput): string[] {
  const { businessName, location, serviceType } = input
  return [
    `${businessName} ${location}`.trim(),
    `${serviceType} ${location}`.trim(),
  ]
}

function buildSuggestions(
  gbp: GBPProfile | { unavailable: true },
  site: WebsiteAudit | { unavailable: true },
  localPack: boolean,
): string[] {
  const s: string[] = []

  if (!localPack) {
    s.push('Få på plass lokal synlighet for hovedsøkeordene; GBP + relevans er grunnmuren.')
  }

  if (!isUnavailable(gbp)) {
    if (!gbp.isVerified) s.push('Press verify your Google Business Profile.')
    if (!gbp.primaryCategory) s.push('Update primary category to match your service.')
    if (!gbp.descriptionExists) s.push('Add a clear business description in GBP.')
    if (!gbp.photos) s.push('Upload quality photos to GBP.')
    if (!gbp.websiteLinked) s.push('Link to website from GBP.')
    if (!gbp.phonePresent) s.push('Add phone number to GBP.')
    if (!gbp.hoursValid) s.push('Add or correct opening hours in GBP.')
  } else {
    s.push('Complete a manual Google Business Profile check (adapter not configured).')
  }

  if (!isUnavailable(site)) {
    if (!site.heroServiceStatement) s.push('Make your homepage communicate service in the first 5 seconds.')
    if (!site.heroPhoneVisible) s.push('Show a tap-to-call number above the fold on mobile.')
    if (site.loadsFastMs !== null && site.loadsFastMs > 2500) s.push('Improve mobile load speed; aim under 2.5s.')
  } else {
    s.push('Review homepage clarity and phone visibility manually (site audit adapter not configured).')
  }

  return dedupe(s)
}

function isUnavailable<T>(obj: T | { unavailable: true }): obj is { unavailable: true } {
  return (obj as any)?.unavailable === true
}

function dedupe(list: string[]): string[] {
  return Array.from(new Set(list))
}
