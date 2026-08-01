const nodemailer = require('nodemailer');

/**
 * Send an email via SMTP.
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML body of the email
 * @returns {Promise<boolean>} Resolves to true if successful, false otherwise
 */
const cleanEnvValue = (val) => {
  if (typeof val === 'string') {
    return val.replace(/^["']|["']$/g, '').trim();
  }
  return val;
};

const sendEmail = async ({ to, subject, html, text, from, replyTo }) => {
  const host = cleanEnvValue(process.env.EMAIL_HOST);
  const user = cleanEnvValue(process.env.EMAIL_USER);
  const pass = cleanEnvValue(process.env.EMAIL_PASS);
  const port = parseInt(cleanEnvValue(process.env.EMAIL_PORT) || '587');
  const secure = cleanEnvValue(process.env.EMAIL_SECURE) === 'true';
  const fromEmail = cleanEnvValue(process.env.EMAIL_FROM);

  // If SMTP is not configured, log a warning and exit gracefully
  if (!host || !user || !pass) {
    console.warn(
      'SMTP Email is not configured. Skipping email delivery. ' +
      'Please add EMAIL_HOST, EMAIL_USER, and EMAIL_PASS to server/.env'
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: from || fromEmail || `"ITNEXUS Contact Portal" <${user}>`,
    to,
    replyTo: replyTo || undefined,
    subject,
    html: html || undefined,
    text: text || undefined,
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
