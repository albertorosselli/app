// Planes de servicio Web-Klar.
// Fuente única de verdad para precios; los contratos referencian estos valores.
//
// Contexto: empresa registrada en Noruega; clientes (personas y organizaciones)
// en Colombia. Por eso la moneda es COP y los textos están en español.
//
// IMPORTANTE: los montos son PROVISIONALES. Confirmar antes de publicar en el
// sitio o de usarlos en un contrato.

export type BillingCycle = 'monthly' | 'yearly'

export interface PlanPricing {
  /** Pago único por construcción y configuración inicial. */
  setupFee: number
  /**
   * Cuota inicial para comenzar el trabajo, como fracción del setupFee (0–1).
   * El saldo se cobra al momento de la entrega/publicación.
   */
  cuotaInicialPct: number
  /** Arriendo de servidor: hosting + mantenimiento recurrente. */
  serverLease: number
  /** Ciclo de facturación del arriendo de servidor. */
  serverLeaseCycle: BillingCycle
}

export interface Plan {
  id: string
  name: string
  tagline: string
  /** Qué incluye el plan (entregables concretos). */
  features: string[]
  pricing: PlanPricing
  /** Plan destacado en la presentación. */
  highlighted?: boolean
}

/** Moneda de facturación para clientes en Colombia. */
export const CURRENCY = 'COP' as const

export const plans: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    tagline: 'Presencia simple y profesional para que te encuentren en Google.',
    features: [
      'Sitio web de una página, optimizado para móvil',
      'Configuración del Perfil de Empresa en Google',
      'Enlace correcto entre Google y el sitio',
      'Botón de contacto y WhatsApp',
    ],
    pricing: {
      setupFee: 800_000, // TODO: confirmar precio de configuración
      cuotaInicialPct: 0.5, // TODO: confirmar % de cuota inicial
      serverLease: 40_000, // TODO: confirmar arriendo mensual
      serverLeaseCycle: 'monthly',
    },
  },
  {
    id: 'profesional',
    name: 'Profesional',
    tagline: 'Sitio de varias secciones con todo lo necesario para convertir.',
    features: [
      'Sitio web de hasta 5 secciones, optimizado para móvil',
      'Configuración del Perfil de Empresa en Google',
      'Formulario de contacto y botón de WhatsApp',
      'Textos y estructura orientados a captar clientes locales',
      'Pequeños ajustes incluidos durante el primer mes',
    ],
    pricing: {
      setupFee: 1_600_000, // TODO: confirmar precio de configuración
      cuotaInicialPct: 0.5, // TODO: confirmar % de cuota inicial
      serverLease: 70_000, // TODO: confirmar arriendo mensual
      serverLeaseCycle: 'monthly',
    },
    highlighted: true,
  },
  {
    id: 'negocio',
    name: 'Negocio',
    tagline: 'Para quienes necesitan mantenimiento y soporte continuo.',
    features: [
      'Todo lo del plan Profesional',
      'Actualizaciones de contenido mensuales',
      'Soporte prioritario',
      'Reportes básicos de visibilidad en Google',
    ],
    pricing: {
      setupFee: 2_800_000, // TODO: confirmar precio de configuración
      cuotaInicialPct: 0.5, // TODO: confirmar % de cuota inicial
      serverLease: 120_000, // TODO: confirmar arriendo mensual
      serverLeaseCycle: 'monthly',
    },
  },
]

/** Monto de la cuota inicial requerida para comenzar el trabajo. */
export function cuotaInicial(plan: Plan): number {
  return Math.round(plan.pricing.setupFee * plan.pricing.cuotaInicialPct)
}

/** Saldo restante del setup, a pagar en la entrega/publicación. */
export function saldoEntrega(plan: Plan): number {
  return plan.pricing.setupFee - cuotaInicial(plan)
}
