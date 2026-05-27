import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import Stripe from 'stripe'
import { fileURLToPath } from 'url'
import { runAudit, defaultAdapters } from '../src/lib/googleCheck'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

type Submission = {
  name: string
  businessName: string
  website?: string
  location: string
  email: string
  createdAt: string
  audit: any
}

const storePath = path.join(__dirname, '..', 'data')
const submissionsPath = path.join(storePath, 'submissions.jsonl')

function appendSubmission(record: Submission) {
  if (!fs.existsSync(storePath)) fs.mkdirSync(storePath)
  fs.appendFileSync(submissionsPath, JSON.stringify(record) + '\n')
}

app.post('/api/submit-audit', async (req, res) => {
  try {
    const { name, business, website, location, email, message } = req.body || {}

    if (!name || !business || !location || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const audit = await runAudit(
      {
        businessName: business,
        location,
        serviceType: business,
        websiteUrl: website,
      },
      defaultAdapters
    )

    const record: Submission = {
      name: sanitize(name),
      businessName: sanitize(business),
      website: website ? sanitize(website) : undefined,
      location: sanitize(location),
      email: sanitize(email),
      createdAt: new Date().toISOString(),
      audit: { ...audit, note: message ? sanitize(message) : undefined },
    }

    appendSubmission(record)

    if (process.env.NOTIFY_EMAIL && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      await sendEmailNotification(record)
    }

    res.json({ ok: true, audit })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Stripe: arriendo de servidor (canon recurrente + cuota inicial + depósito
// en la primera factura). El software se vende con Payment Links, sin código.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

app.post('/api/checkout/server-lease', async (_req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe no está configurado' })
  }

  const leasePrice = process.env.STRIPE_PRICE_SERVER_LEASE
  const cuotaInicialPrice = process.env.STRIPE_PRICE_CUOTA_INICIAL
  const depositPrice = process.env.STRIPE_PRICE_DEPOSIT

  if (!leasePrice || !cuotaInicialPrice || !depositPrice) {
    return res.status(500).json({ error: 'Faltan IDs de precio de Stripe' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: leasePrice, quantity: 1 },
        { price: cuotaInicialPrice, quantity: 1 },
        { price: depositPrice, quantity: 1 },
      ],
      consent_collection: { terms_of_service: 'required' },
      success_url: `${process.env.CHECKOUT_SUCCESS_URL ?? 'http://localhost:5173/gracias'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.CHECKOUT_CANCEL_URL ?? 'http://localhost:5173/',
    })
    res.json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudo crear la sesión de pago' })
  }
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})

function sanitize(input: string) {
  return String(input).trim().slice(0, 500)
}

async function sendEmailNotification(record: Submission) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const msg = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL!,
    subject: `Ny Google-sjekk: ${record.businessName}`,
    text: JSON.stringify(record.audit, null, 2),
  }

  await transporter.sendMail(msg)
}
