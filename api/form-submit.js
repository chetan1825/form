import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const data = req.body

    console.log('Form Data:', data)

    // 1️⃣ Send Thank You Email to the Person
    await resend.emails.send({
      from: 'FormBot <onboarding@resend.dev>',
      to: data.email,
      subject: 'Thank you for submitting the form!',
      html: `
        <h2>Hi ${data.Name || 'there'} 👋</h2>
        <p>Thanks for reaching out! We’ll get back to you soon on this email: <b>${data.email}</b>.</p>
        <p>We’re launching soon and will send updates directly to your inbox 🚀</p>
      `,
    })

    // 2️⃣ Send Notification to You (Fallback Mail)
    await resend.emails.send({
      from: 'FormBot <no-reply@yourdomain.com>',
      to: 'yourfallback@email.com', // 👈 replace with your own
      subject: 'New Form Submission',
      html: `
        <h3>New Submission Received</h3>
        <ul>
          <li><b>Name:</b> ${data.Name}</li>
          <li><b>Mobile:</b> ${data['Mobile Number']}</li>
          <li><b>City:</b> ${data.City}</li>
          <li><b>Email:</b> ${data.email}</li>
          <li><b>Vehicle Type:</b> ${data['Vehicle Type']}</li>
          <li><b>Radio:</b> ${data.Radio}</li>
        </ul>
      `,
    })

    console.log('✅ Emails sent successfully')
    return res.status(200).json({ success: true, message: 'Emails sent successfully!' })
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    return res.status(500).json({ success: false, message: 'Server error', error })
  }
}
