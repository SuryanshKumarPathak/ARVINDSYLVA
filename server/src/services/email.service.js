const nodemailer = require('nodemailer');
const logger = require('../config/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  init() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      logger.warn('Email service not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in .env');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendNewLeadNotification(lead) {
    if (!this.transporter) return;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!adminEmail) return;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px;">
        <div style="background:#1a3a2a;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
          <h1 style="color:#c9a84c;margin:0;font-size:22px;">🌿 New Lead – Arvind Sylva</h1>
        </div>
        <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;color:#666;font-weight:bold;width:40%;">Lead ID</td><td style="padding:8px;">${lead.leadId}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:8px;color:#666;font-weight:bold;">Name</td><td style="padding:8px;">${lead.fullName}</td></tr>
            <tr><td style="padding:8px;color:#666;font-weight:bold;">Phone</td><td style="padding:8px;">${lead.phone}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:8px;color:#666;font-weight:bold;">Email</td><td style="padding:8px;">${lead.email}</td></tr>
            <tr><td style="padding:8px;color:#666;font-weight:bold;">City</td><td style="padding:8px;">${lead.city}, ${lead.state}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:8px;color:#666;font-weight:bold;">Configuration</td><td style="padding:8px;">${lead.preferredConfiguration || 'Not specified'}</td></tr>
            <tr><td style="padding:8px;color:#666;font-weight:bold;">Source</td><td style="padding:8px;">${lead.source || 'Direct'}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:8px;color:#666;font-weight:bold;">Campaign</td><td style="padding:8px;">${lead.campaign || 'N/A'}</td></tr>
            <tr><td style="padding:8px;color:#666;font-weight:bold;">Device</td><td style="padding:8px;">${lead.deviceType}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:8px;color:#666;font-weight:bold;">Time</td><td style="padding:8px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
            ${lead.message ? `<tr><td style="padding:8px;color:#666;font-weight:bold;">Message</td><td style="padding:8px;">${lead.message}</td></tr>` : ''}
          </table>
        </div>
        <p style="text-align:center;color:#999;font-size:12px;margin-top:16px;">Arvind Sylva CRM • Sarjapur, Bangalore</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Arvind Sylva'}" <${process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `🏠 New Lead: ${lead.fullName} – ${lead.phone} | Arvind Sylva`,
        html,
      });
      logger.info(`Lead notification email sent for ${lead.leadId}`);
    } catch (err) {
      logger.error(`Failed to send lead notification: ${err.message}`);
      throw err;
    }
  }
}

module.exports = new EmailService();
