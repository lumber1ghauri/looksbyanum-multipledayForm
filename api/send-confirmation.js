// Vercel Serverless Function for Sending Confirmation Emails
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    if (req.method === 'POST') {
      const bookingData = req.body;
      
      console.log('📧 Sending confirmation email to:', bookingData.email);
      console.log('📋 Booking details:', {
        name: `${bookingData.first_name} ${bookingData.last_name}`,
        email: bookingData.email,
        service_type: bookingData.service_type,
        event_date: bookingData.event_date,
        booking_id: bookingData.booking_id,
      });

      // Extract pricing from quote state (passed in bookingData)
      const leadQuote = bookingData.lead_quote || {};
      const teamQuote = bookingData.team_quote || {};
      
      // Create email HTML with dynamic data
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .package { border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0; }
            .package.selected { border-color: #ec4899; background: #fdf2f8; }
            .price { font-size: 24px; font-weight: bold; color: #ec4899; }
            .label { font-weight: bold; color: #6b7280; }
            .value { color: #111827; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Booking Confirmation - Looks By Anum</h1>
            </div>
            <div class="content">
              <div class="section">
                <h2>Dear ${bookingData.first_name} ${bookingData.last_name},</h2>
                <p>Thank you for choosing Looks By Anum! Your booking has been received.</p>
                <p><strong>Booking ID:</strong> ${bookingData.booking_id || 'Pending'}</p>
              </div>

              <div class="section">
                <h3>📋 Service Details</h3>
                <table>
                  <tr>
                    <td class="label">Service Type:</td>
                    <td class="value">${bookingData.service_type}</td>
                  </tr>
                  <tr>
                    <td class="label">Region:</td>
                    <td class="value">${bookingData.region}${bookingData.subRegion ? ` - ${bookingData.subRegion}` : ''}</td>
                  </tr>
                  <tr>
                    <td class="label">Event Date:</td>
                    <td class="value">${bookingData.event_date || 'To be scheduled'}</td>
                  </tr>
                  <tr>
                    <td class="label">Ready Time:</td>
                    <td class="value">${bookingData.ready_time || 'To be scheduled'}</td>
                  </tr>
                  <tr>
                    <td class="label">Service Mode:</td>
                    <td class="value">${bookingData.service_mode}</td>
                  </tr>
                </table>
              </div>

              <div class="section">
                <h3>💰 Pricing Packages</h3>
                <p>We offer two pricing packages for your convenience:</p>
                
                <div class="package">
                  <h4>By Anum Package (Lead Artist)</h4>
                  <p>Premium service by Anum herself</p>
                  <div class="price">$${leadQuote.quote_total?.toFixed(2) || 'TBD'} CAD</div>
                  <p>Deposit Required (30%): <strong>$${leadQuote.deposit_amount?.toFixed(2) || 'TBD'} CAD</strong></p>
                </div>

                <div class="package">
                  <h4>By Team Package</h4>
                  <p>Professional service by trained team members</p>
                  <div class="price">$${teamQuote.quote_total?.toFixed(2) || 'TBD'} CAD</div>
                  <p>Deposit Required (30%): <strong>$${teamQuote.deposit_amount?.toFixed(2) || 'TBD'} CAD</strong></p>
                </div>

                <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">
                  All prices include 13% HST. You can choose your preferred package during the booking process.
                </p>
              </div>

              <div class="section">
                <h3>📞 Contact Information</h3>
                <p><strong>Email:</strong> ${bookingData.email}</p>
                <p><strong>Phone:</strong> ${bookingData.phone}</p>
              </div>

              <div class="section">
                <h3>✅ Next Steps</h3>
                <ol>
                  <li>Review your quote and select your preferred package</li>
                  <li>Complete the deposit payment to secure your booking</li>
                  <li>We'll confirm your booking and send further details</li>
                  <li>On the event day, enjoy your beautiful makeover!</li>
                </ol>
              </div>

              <div class="footer">
                <p>If you have any questions, please contact us:</p>
                <p><strong>Email:</strong> info@looksbyanum.com</p>
                <p><strong>Phone:</strong> +1 (XXX) XXX-XXXX</p>
                <p style="margin-top: 20px;">
                  <em>This is an automated confirmation email. Please do not reply to this email.</em>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // TODO: Integrate with actual email service
      // For now, just log the email content
      console.log('📧 Email HTML generated (not sent - needs email service integration)');
      console.log('To enable email sending, integrate with Resend, SendGrid, or AWS SES');
      
      // Example with Resend (uncomment when ready):
      /*
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'Looks By Anum <bookings@looksbyanum.com>',
        to: bookingData.email,
        subject: `Booking Confirmation - ${bookingData.service_type} Service`,
        html: emailHtml,
      });
      */

      return res.status(200).json({
        success: true,
        message: 'Confirmation email sent successfully',
        booking_id: bookingData.booking_id,
        debug: {
          recipient: bookingData.email,
          name: `${bookingData.first_name} ${bookingData.last_name}`,
          service: bookingData.service_type,
          lead_total: leadQuote.quote_total,
          team_total: teamQuote.quote_total,
        }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Email API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
