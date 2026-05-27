// Planes de VeraPOS.
// Fuente única de verdad para precios; los contratos referencian estos valores.
//
// Contexto: empresa registrada en Noruega; clientes (personas y organizaciones)
// en Colombia. Moneda COP, textos en español.
//
// Datos tomados del sitio actual de VeraPOS. Modelo de cobro: suscripción
// mensual, "sin contrato". El servidor local es un arriendo independiente del
// plan. Hoy NO existe cuota inicial; introducirla sería una decisión nueva
// (ver nota al final).

export type BillingCycle = 'monthly' | 'yearly'

/** Moneda de facturación para clientes en Colombia. */
export const CURRENCY = 'COP' as const

export interface Plan {
  id: string
  name: string
  /** Precio recurrente de la suscripción. */
  price: number
  billingCycle: BillingCycle
  /** Distintivos cortos: "Sin contrato", "Gratis el primer mes", etc. */
  badges: string[]
  summary: string
  features: string[]
  smartFeaturesTitle?: string
  smartFeatures?: string[]
  implementationTitle: string
  implementation: string
  /** Plan destacado en la presentación. */
  highlighted?: boolean
}

/** Arriendo de servidor local. Independiente del plan elegido. */
export interface ServerLease {
  name: string
  /** Canon recurrente del arriendo. */
  price: number
  billingCycle: BillingCycle
  /** Cuota inicial: pago único NO reembolsable al iniciar el arriendo. */
  cuotaInicial: number
  /** Depósito de garantía REEMBOLSABLE sobre el equipo. */
  deposit: number
  summary: string
  includes: string[]
  note: string
}

export const plans: Plan[] = [
  {
    id: 'basico',
    name: 'Plan Básico',
    price: 89_000,
    billingCycle: 'monthly',
    badges: ['Gratis el primer mes', 'Sin contrato'],
    summary:
      'Para tiendas que quieren empezar rápido, vender, facturar y controlar inventario sin complicarse.',
    features: [
      'Facturación electrónica automática con DIAN',
      'Ventas, caja y pagos integrados',
      'Inventario en tiempo real',
      'Devoluciones con notas crédito y débito automáticas ante DIAN',
      'Registro de compras y facturas de proveedores',
      'Clientes y cartera — crédito, cobros, historial por cliente',
      'Respaldo seguro en la nube',
      'Operación estable para una terminal',
      'Soporte remoto incluido',
      'Vista remota de ventas e inventario',
      'Funciones inteligentes incluidas',
    ],
    smartFeaturesTitle: 'Funciones inteligentes incluidas',
    smartFeatures: [
      'Mejora automática de nombres de productos',
      'Descripciones automáticas de productos',
      'Enriquecimiento automático al importar desde Excel',
      'Más de 2.700 referencias colombianas precargadas — al escanear un código de barras nuevo, VeraPOS busca en el catálogo antes de pedirte crear el producto',
    ],
    implementationTitle: 'Implementación',
    implementation:
      'Configuración rápida, capacitación incluida y listo para vender en pocos días.',
  },
  {
    id: 'pro',
    name: 'Plan Pro',
    price: 159_000,
    billingCycle: 'monthly',
    badges: ['Toda la IA incluida', 'Sin contrato'],
    summary:
      'Todo lo del plan Básico, más automatización avanzada con IA para ahorrar tiempo operativo todos los días.',
    features: [
      'Facturación electrónica en segundo plano',
      'Venta continua sin bloqueos',
      'Inventario completo y control de compras',
      'Cartera y cuentas por pagar',
      'Múltiples terminales conectadas',
      'Monitoreo técnico proactivo',
      'Recuperación prioritaria',
      'Dashboard remoto para propietarios',
      'Automatización avanzada con IA',
    ],
    smartFeaturesTitle: 'Funciones IA avanzadas',
    smartFeatures: [
      'Escaneo de facturas de proveedor por foto',
      'Creación de productos desde imágenes',
      'Categorización automática',
      'Enriquecimiento masivo de catálogos',
      'Sugerencias inteligentes de recompra',
      'Detección de anomalías — cada día la IA revisa todas las transacciones y marca descuentos inusuales, anulaciones repetidas y ventas fuera de horario; los eventos de alto riesgo llegan en alerta inmediata al propietario',
      'Segmentación automática de clientes — cada semana VeraPOS clasifica tus clientes en VIP, Frecuente, Nuevo, En riesgo y Ocasional, sin configuración manual',
    ],
    implementationTitle: 'Implementación profesional',
    implementation:
      'Migración de datos, configuración completa y acompañamiento continuo en operación.',
    highlighted: true,
  },
]

export const serverLease: ServerLease = {
  name: 'Servidor local en arriendo',
  price: 75_000,
  billingCycle: 'monthly',
  cuotaInicial: 150_000,
  deposit: 250_000,
  summary: 'Para negocios que prefieren no comprar hardware desde el inicio.',
  includes: [
    'Servidor Dell OptiPlex listo para operar',
    'Instalación y configuración de VeraPOS',
    'Disco principal + disco de respaldo',
    'Soporte y mantenimiento',
    'Renovación de equipo cada 3 años',
  ],
  note: 'El servidor es independiente del plan. Puedes usar tu propio equipo o alquilarlo con nosotros.',
}
