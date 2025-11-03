import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { Name, Email, City, "Mobile Number": MobileNumber, "Vehicle Type": VehicleType, Radio } = req.body;

    // Send thank-you email
    await resend.emails.send({
      from: "Your Project <noreply@yourdomain.com>",
      to: Email,
      subject: "Thank you for submitting the form!",
      html: `
        <h2>Hey ${Name || "there"},</h2>
        <p>Thank you for submitting the form 🚀</p>
        <p>We’re launching soon and will keep you updated at <b>${Email}</b>.</p>
        <br/>
        <p><b>Submitted Info:</b></p>
        <ul>
          <li>City: ${City}</li>
          <li>Mobile: ${MobileNumber}</li>
          <li>Vehicle: ${VehicleType}</li>
          <li>Radio: ${Radio}</li>
        </ul>
        <br/>
        <p>— Team</p>
      `,
    });

    // Respond success
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: error.message });
  }
}
