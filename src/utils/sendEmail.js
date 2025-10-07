

const resend =(process.env.RESEND_API_KEY);

export const sendEmail = async (email, name) => {
  try {
    const data = await resend.emails.send({
      from: "Online Counseling <onboarding@resend.dev>",
      to: email,
      subject: "🎉 Welcome to Online Counseling Platform",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
          <h2 style="color:#4F46E5;">Hi ${name},</h2>
          <p>We’re excited to have you on board! 🎉</p>
          <p>You have successfully registered on the <strong>Online Counseling Platform</strong>.</p>
          <ul>
            <li>Book counseling sessions</li>
            <li>Chat with our counselors</li>
            <li>Manage your appointments in the dashboard</li>
          </ul>
          <p style="margin-top:20px;">Wishing you the best on your journey 🌟</p>
          <p>— The Online Counseling Team</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", data);
  } catch (err) {
    console.error("❌ Email sending error:", err);
  }
};
