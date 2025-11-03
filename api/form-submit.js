import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, city, mobileNumber, vehicleType, radio } = req.body;

  try {
    await resend.emails.send({
      from: "Your Brand <noreply@yourdomain.com>",
      to: email,
      subject: "Thank you for submitting the form!",
      html: `
        <h2>Hey ${name},</h2>
        <p>Thank you for submitting the form. We’re launching soon 🚀</p>
        <p>We’ll send you updates and notifications about our products at <b>${email}</b>.</p>
        <br/>
        <p>— The Team</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
