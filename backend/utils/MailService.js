import axios from "axios";

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const payload = {
      sender: { email: process.env.BREVO_SENDER },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html || `<p>${text}</p>`,
    };

    console.log("email payload:", payload);

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,   // 🔥 REQUIRED
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (error) {
    console.error("Email error:", error.message);
    console.error(error.response?.data);
  }
};
