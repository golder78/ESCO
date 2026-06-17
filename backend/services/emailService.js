const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendWelcomeEmail = async (user, verificationToken) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Welcome to Esco! Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Esco, ${user.name}! 🎉</h2>

          <p style="color: #666; line-height: 1.6;">
            Thank you for creating an account with us. We're excited to have you join our e-commerce platform.
          </p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Get Started:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Browse our wide selection of products</li>
              <li>Add items to your cart</li>
              <li>Complete secure checkout with M-Pesa payment</li>
              <li>Track your orders in real-time</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Your Email
            </a>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Or copy and paste this link in your browser:<br/>
            <code style="background-color: #f5f5f5; padding: 5px 10px; border-radius: 3px;">${verificationLink}</code>
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

          <p style="color: #999; font-size: 12px;">
            If you didn't create this account, please ignore this email.<br/>
            © 2026 Esco. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    return false;
  }
};

const sendContactNotification = async (contact) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Contact Form Submission from ${contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission 📧</h2>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Status:</strong> <span style="background-color: #ffc107; padding: 5px 10px; border-radius: 3px; color: #333;">${contact.status || "New"}</span></p>
          </div>

          <h3 style="color: #333;">Message:</h3>
          <p style="color: #666; line-height: 1.6; white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${contact.message}
          </p>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Submitted on: ${new Date(contact.createdAt).toLocaleString()}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact notification sent to ${process.env.COMPANY_EMAIL}`);
    return true;
  } catch (error) {
    console.error("Error sending contact notification:", error.message);
    return false;
  }
};

module.exports = { sendWelcomeEmail, sendContactNotification };
