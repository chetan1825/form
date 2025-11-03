// api/form-submit.js
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  // Vercel functions receive the body parsed already for JSON
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, email, city } = req.body || {}

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    // 1) Send welcome / launch-soon email to the submitter
    await resend.emails.send({
      from: "Your Brand <hello@yourdomain.com>",
      to: email,
      subject: "🎉 Thanks for joining — we’re launching soon!",
      html: `
        <p>Hi ${name || "there"},</p>
        <p>Thanks for joining our early access list. We’re launching soon — you’ll receive regular updates and exclusive previews of our products.</p>
        <p>Cheers,<br/><strong>Your Brand Team</strong></p>
      `,
    })

    // 2) Optional: notify yourself about the new signup
    await resend.emails.send({
      from: "Notifier <no-reply@yourdomain.com>",
      to: "you@yourdomain.com",
      subject: "📩 New Form Submission",
      html: `
        <p><strong>Name:</strong> ${name || "N/A"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>City:</strong> ${city || "N/A"}</p>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error("Email send error:", err)
    return res.status(500).json({ error: "Failed to send email" })
  }
}
