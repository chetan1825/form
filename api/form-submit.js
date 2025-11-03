import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// This function handles POST requests from Framer
export default async function handler(req, res) {
  // 1. Only allow POST method (Framer sends POST)
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // 2. Extract the form data
    const data = req.body;

    // Framer usually sends keys based on your field names
    const name = data.Name || data.name || "there";
    const email = data.email || data.Email;
    const city = data.City || "";
    const mobile = data["Mobile Number"] || data.mobileNumber || "";
    const vehicle = data["Vehicle Type"] || data.vehicleType || "";
    const radio = data.Radio || "";

    console.log("✅ Form Data Received:", data);

    // 3. Send thank-you email through Resend
    await resend.emails.send({
      from: "Your Brand <noreply@yourdomain.com>", // customize this
      to: email,
      subject: "Thank you for submitting the form!",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;">
          <h2>Hey ${name},</h2>
          <p>Thank you for getting in touch! 🚀</p>
          <p>We’re launching soon and will send updates to <b>${email}</b>.</p>
          <hr/>
          <p><b>Your Info:</b></p>
          <ul>
            <li>City: ${city}</li>
            <li>Mobile: ${mobile}</li>
            <li>Vehicle: ${vehicle}</li>
            <li>Radio: ${radio}</li>
          </ul>
          <p>— Team</p>
        </div>
      `,
    });

    // 4. Return success to Framer
    return res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
