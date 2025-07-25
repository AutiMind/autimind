// Email notification utilities
// This uses a simple approach with mailto links and webhook notifications
// For production, integrate with services like SendGrid, Mailgun, or Resend

interface ContactData {
  id: number;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  submitted_at: string;
}

interface EmailConfig {
  to: string;
  from: string;
  apiKey?: string;
}

// Simple webhook notification (can be integrated with Slack, Discord, etc.)
export async function sendWebhookNotification(contact: ContactData, webhookUrl?: string) {
  if (!webhookUrl) return;

  const payload = {
    text: `🆕 New Contact Form Submission`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*New Contact Form Submission*\n\n*Name:* ${contact.name}\n*Email:* ${contact.email}\n*Company:* ${contact.company || 'Not provided'}\n*Subject:* ${contact.subject}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Message:*\n${contact.message.substring(0, 300)}${contact.message.length > 300 ? '...' : ''}`
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View in Admin"
            },
            url: `https://autimind.com/admin`
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Reply via Email"
            },
            url: `mailto:${contact.email}?subject=Re: ${contact.subject}&body=Hi ${contact.name},%0A%0AThank you for contacting AutiMind.%0A%0A`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Webhook notification failed:', response.statusText);
    }
  } catch (error) {
    console.error('Webhook notification error:', error);
  }
}

// Email notification using Resend API (recommended for production)
export async function sendEmailNotification(contact: ContactData, config: EmailConfig) {
  if (!config.apiKey) {
    console.log('Email API key not configured, skipping email notification');
    return;
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #14b8a6, #06b6d4); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-top: 5px; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #14b8a6; margin-top: 10px; }
        .btn { display: inline-block; background: #14b8a6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🆕 New Contact Form Submission</h1>
          <p>Someone has submitted a contact form on AutiMind.com</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${contact.name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${contact.email}">${contact.email}</a></div>
          </div>
          
          ${contact.company ? `
          <div class="field">
            <div class="label">Company:</div>
            <div class="value">${contact.company}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">Subject:</div>
            <div class="value">${contact.subject}</div>
          </div>
          
          <div class="field">
            <div class="label">Message:</div>
            <div class="message-box">${contact.message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date(contact.submitted_at).toLocaleString()}</div>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://autimind.com/admin" class="btn">View in Admin Dashboard</a>
            <a href="mailto:${contact.email}?subject=Re: ${contact.subject}&body=Hi ${contact.name},%0A%0AThank you for contacting AutiMind.%0A%0A" class="btn">Reply to Contact</a>
          </div>
        </div>
        
        <div class="footer">
          <p>This notification was sent automatically from AutiMind.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
New Contact Form Submission

Name: ${contact.name}
Email: ${contact.email}
Company: ${contact.company || 'Not provided'}
Subject: ${contact.subject}

Message:
${contact.message}

Submitted: ${new Date(contact.submitted_at).toLocaleString()}

View in admin: https://autimind.com/admin
Reply: mailto:${contact.email}
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject: `New Contact: ${contact.subject}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Email notification failed:', error);
    } else {
      console.log('Email notification sent successfully');
    }
  } catch (error) {
    console.error('Email notification error:', error);
  }
}

// Fallback: Generate mailto link for manual sending
export function generateNotificationEmail(contact: ContactData): string {
  const subject = `New Contact: ${contact.subject}`;
  const body = `New contact form submission:

Name: ${contact.name}
Email: ${contact.email}
Company: ${contact.company || 'Not provided'}
Subject: ${contact.subject}

Message:
${contact.message}

Submitted: ${new Date(contact.submitted_at).toLocaleString()}

You can reply directly to ${contact.email}`;

  return `mailto:andrea@autimind.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}