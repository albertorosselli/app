import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
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
