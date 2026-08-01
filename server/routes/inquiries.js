const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const PageContent = require('../models/PageContent');
const sendEmail = require('../utils/sendEmail');
const auth = require('../middleware/auth');

// @route   POST api/inquiries
// @desc    Submit a client inquiry (public)
// @access  Public
router.post('/', async (req, res) => {
  const { clientName, clientEmail, phone, projectScope, message } = req.body;

  // Simple email validation
  if (!clientEmail || !clientEmail.includes('@')) {
    return res.status(400).json({ message: 'A valid email address is required' });
  }

  if (!clientName || !message) {
    return res.status(400).json({ message: 'Name and message details are required' });
  }

  try {
    const newInquiry = new Inquiry({
      clientName,
      clientEmail,
      phone,
      projectScope,
      message,
      status: 'New'
    });

    const inquiry = await newInquiry.save();

    // Fetch destination email from database settings
    let content = await PageContent.findOne();
    const recipientEmail = content?.contactEmail || 'info@itnexus.org';

    // Format the email message body
    const emailSubject = `New Project Inquiry: ${projectScope} from ${clientName}`;
    const emailBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">New Inquiry Received</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 140px;">Client Name:</td>
            <td style="padding: 8px 0; color: #0f172a;">${clientName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Client Email:</td>
            <td style="padding: 8px 0; color: #3b82f6;"><a href="mailto:${clientEmail}">${clientEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Phone Number:</td>
            <td style="padding: 8px 0; color: #0f172a;">${phone || 'Not Provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Project Area:</td>
            <td style="padding: 8px 0; color: #0f172a;"><span style="background-color: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 14px;">${projectScope}</span></td>
          </tr>
        </table>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #0f172a;">Message:</h4>
          <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          This email was sent automatically from the ITNEXUS Contact Portal.
        </p>
      </div>
    `;

    // Send email asynchronously in the background so it doesn't block the API response
    sendEmail({
      to: recipientEmail,
      from: `"${clientName} via ITNEXUS" <${process.env.EMAIL_USER}>`,
      replyTo: clientEmail,
      subject: emailSubject,
      html: emailBody
    });

    res.json(inquiry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/inquiries
// @desc    Get all inquiries (admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/inquiries/:id
// @desc    Update inquiry status workflow state
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  if (!status || !['New', 'Reviewed', 'Responded'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status workflow state' });
  }

  try {
    let inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.status = status;
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/inquiries/:id
// @desc    Delete an inquiry log
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry log removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
