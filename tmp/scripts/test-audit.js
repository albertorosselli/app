import { runAudit, defaultAdapters } from '../src/lib/googleCheck';
const adapters = {
    ...defaultAdapters,
    search: {
        async runIncognitoSearch(query) {
            return {
                query,
                foundInLocalPack: query.toLowerCase().includes('service'),
                organicPresence: false,
                mapSnippet: true,
            };
        },
    },
    gbp: {
        async fetchProfile() {
            return {
                primaryCategory: 'Plumber',
                isVerified: false,
                phonePresent: true,
                websiteLinked: true,
                hoursValid: true,
                descriptionExists: false,
                photos: false,
                reviewCount: 3,
                rating: 3.8,
            };
        },
    },
    site: {
        async auditSite() {
            return {
                heroPhoneVisible: true,
                heroServiceStatement: false,
                loadsFastMs: 2180,
            };
        },
    },
};
async function main() {
    const result = await runAudit({
        businessName: 'Eksempel Rør',
        location: 'Oslo',
        serviceType: 'Rørlegger',
        websiteUrl: 'https://example.com',
    }, adapters);
    console.log(JSON.stringify(result, null, 2));
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
