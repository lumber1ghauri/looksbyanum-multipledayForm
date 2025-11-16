// Vercel Serverless Function for Booking Management
import { kv } from '@vercel/kv';

// Enable CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    if (req.method === 'POST') {
      // Create new booking
      const bookingData = req.body;
      
      // Generate unique booking ID
      const bookingId = `BK-${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      bookingData.unique_id = bookingId;
      bookingData.booking_id = bookingId;
      bookingData.created_at = new Date().toISOString();
      bookingData.updated_at = new Date().toISOString();
      
      // Store in Vercel KV (key-value store)
      await kv.set(`booking:${bookingId}`, JSON.stringify(bookingData));
      
      // Add to bookings list
      await kv.lpush('bookings:all', bookingId);
      
      console.log('✅ Booking created:', bookingId);
      
      return res.status(201).json({
        success: true,
        booking_id: bookingId,
        unique_id: bookingId,
        message: 'Booking created successfully',
      });
    }
    
    if (req.method === 'GET') {
      // Get booking by ID
      const { id } = req.query;
      
      if (id) {
        const booking = await kv.get(`booking:${id}`);
        if (!booking) {
          return res.status(404).json({
            success: false,
            error: 'Booking not found',
          });
        }
        
        const bookingData = typeof booking === 'string' ? JSON.parse(booking) : booking;
        return res.status(200).json(bookingData);
      }
      
      // Get all bookings
      const bookingIds = await kv.lrange('bookings:all', 0, -1);
      const bookings = [];
      
      for (const id of bookingIds) {
        const booking = await kv.get(`booking:${id}`);
        if (booking) {
          const bookingData = typeof booking === 'string' ? JSON.parse(booking) : booking;
          bookings.push(bookingData);
        }
      }
      
      return res.status(200).json(bookings);
    }
    
    if (req.method === 'PUT') {
      // Update booking
      const { id } = req.query;
      const updateData = req.body;
      
      const existing = await kv.get(`booking:${id}`);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found',
        });
      }
      
      const existingData = typeof existing === 'string' ? JSON.parse(existing) : existing;
      const updatedData = {
        ...existingData,
        ...updateData,
        updated_at: new Date().toISOString(),
      };
      
      await kv.set(`booking:${id}`, JSON.stringify(updatedData));
      
      console.log('✅ Booking updated:', id);
      
      return res.status(200).json({
        success: true,
        booking_id: id,
        message: 'Booking updated successfully',
      });
    }
    
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error('❌ Bookings API Error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
