const nodemailer = require('nodemailer');

/**
 * Send an email via SMTP.
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML body of the email
 * @returns {Promise<boolean>} Resolves to true if successful, false otherwise
 */
const sendEmail = async ({ to, subject, html, from, replyTo }) => {
  // If SMTP is not configured, log a warning and exit gracefully
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      'SMTP Email is not configured. Skipping email delivery. ' +
      'Please add EMAIL_HOST, EMAIL_USER, and EMAIL_PASS to server/.env'
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for port 465, false for port 587/25
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: from || process.env.EMAIL_FROM || `"ITNEXUS Contact Portal" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: replyTo || undefined,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error('SMTP Email sending error:', err);
    return false;
  }
};

module.exports = sendEmail;
