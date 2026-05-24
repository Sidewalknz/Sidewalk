'use server';

import { resend } from '@/lib/resend';

export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { error: 'Please fill in all required fields.' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.CONTACT_FROM_NAME || 'Sidewalk Contact Form'} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: [process.env.CONTACT_TO_EMAIL as string],
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      replyTo: email,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0; }
              .header { background-color: #0f172a; padding: 40px; text-align: center; }
              .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; }
              .content { padding: 40px; }
              .field { margin-bottom: 24px; }
              .label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 4px; }
              .value { font-size: 16px; color: #1e293b; font-weight: 500; }
              .message-box { background-color: #f1f5f9; padding: 24px; border-radius: 12px; border-left: 4px solid #2563eb; color: #334155; margin-top: 8px; }
              .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Sidewalk</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value">${email}</div>
                </div>
                <div class="field">
                  <div class="label">Subject</div>
                  <div class="value">${subject || 'No Subject'}</div>
                </div>
                <div class="field">
                  <div class="label">Message</div>
                  <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} Sidewalk. All rights reserved.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { error: 'Failed to send email. Please try again later.' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Contact Action Error:', err);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
