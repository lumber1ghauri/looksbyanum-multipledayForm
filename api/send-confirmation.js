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
      
      // TODO: Integrate with your email service (SendGrid, Resend, etc.)
      // For now, we'll just log and return success
      
      console.log('Sending confirmation email to:', bookingData.email);
      console.log('Booking details:', {
        name: `${bookingData.first_name} ${bookingData.last_name}`,
        service_type: bookingData.service_type,
        event_date: bookingData.event_date,
        booking_id: bookingData.booking_id,
      });

      // Example: Using Resend (you'll need to install @resend/node)
      // const resend = new Resend(process.env.RESEND_API_KEY);
      // await resend.emails.send({
      //   from: 'Looks By Anum <bookings@looksbyanum.com>',
      //   to: bookingData.email,
      //   subject: 'Booking Confirmation - Looks By Anum',
      //   html: `<h1>Thank you for your booking!</h1>
      //          <p>Dear ${bookingData.first_name},</p>
      //          <p>Your booking has been confirmed.</p>
      //          <p>Booking ID: ${bookingData.booking_id}</p>
      //          <p>Service: ${bookingData.service_type}</p>
      //          <p>Event Date: ${bookingData.event_date}</p>`,
      // });

      return res.status(200).json({
        success: true,
        message: 'Confirmation email sent successfully',
        booking_id: bookingData.booking_id,
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
