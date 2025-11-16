// Vercel Serverless Function for Booking Management
import { createClient } from 'redis';

// Enable CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Create Redis client
let redisClient = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    
    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    
    await redisClient.connect();
    console.log('✅ Redis connected successfully');
  }
  return redisClient;
}

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
      
      // Get Redis client
      const client = await getRedisClient();
      
      // Store in Redis
      await client.set(`booking:${bookingId}`, JSON.stringify(bookingData));
      
      // Add to bookings list
      await client.lPush('bookings:all', bookingId);
      
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
      const client = await getRedisClient();
      
      if (id) {
        const booking = await client.get(`booking:${id}`);
        if (!booking) {
          return res.status(404).json({
            success: false,
            error: 'Booking not found',
          });
        }
        
        const bookingData = JSON.parse(booking);
        return res.status(200).json(bookingData);
      }
      
      // Get all bookings
      const bookingIds = await client.lRange('bookings:all', 0, -1);
      const bookings = [];
      
      for (const id of bookingIds) {
        const booking = await client.get(`booking:${id}`);
        if (booking) {
          const bookingData = JSON.parse(booking);
          bookings.push(bookingData);
        }
      }
      
      return res.status(200).json(bookings);
    }
    
    if (req.method === 'PUT') {
      // Update booking
      const { id } = req.query;
      const updateData = req.body;
      const client = await getRedisClient();
      
      const existing = await client.get(`booking:${id}`);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found',
        });
      }
      
      const existingData = JSON.parse(existing);
      const updatedData = {
        ...existingData,
        ...updateData,
        updated_at: new Date().toISOString(),
      };
      
      await client.set(`booking:${id}`, JSON.stringify(updatedData));
      
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
