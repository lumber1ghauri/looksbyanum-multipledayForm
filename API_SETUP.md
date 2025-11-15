# Backend API Setup Instructions

Your backend API is now created using Vercel Serverless Functions. Here's how to use it:

## 📁 API Structure

```
api/
├── bookings.js           # Create, read, update bookings
├── quote.js              # Generate price quotes
└── send-confirmation.js  # Send confirmation emails
```

## 🚀 Local Development

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Install Vercel KV package:**
   ```bash
   npm install @vercel/kv
   ```

3. **Run development server:**
   ```bash
   vercel dev
   ```

4. **Access your app at:** `http://localhost:3000`

### Option 2: Using Vite (Frontend Only)

If you just want to test the frontend without the backend:
```bash
npm run dev
```

Note: API calls will fail without the backend running.

## 📦 Dependencies to Install

Run these commands:

```bash
npm install @vercel/kv
npm install -g vercel
```

## 🌐 Deployment to Vercel

1. **Link your project to Vercel:**
   ```bash
   vercel link
   ```

2. **Set up Vercel KV Database:**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to "Storage" tab
   - Create a new "KV" database
   - It will automatically add the environment variables

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🔧 Environment Variables

### For Local Development (`.env.local`):
```
VITE_API_URL=/api
```

### For Vercel (set in dashboard):
- `KV_URL` - Auto-added by Vercel KV
- `KV_REST_API_URL` - Auto-added by Vercel KV
- `KV_REST_API_TOKEN` - Auto-added by Vercel KV
- `KV_REST_API_READ_ONLY_TOKEN` - Auto-added by Vercel KV

## 📧 Email Configuration (Optional)

To enable email sending, you need to:

1. **Choose an email service:**
   - [Resend](https://resend.com) (Recommended - 100 free emails/day)
   - [SendGrid](https://sendgrid.com)
   - [AWS SES](https://aws.amazon.com/ses/)

2. **Install the email package:**
   ```bash
   npm install resend  # or @sendgrid/mail, or aws-sdk
   ```

3. **Update `api/send-confirmation.js`:**
   - Uncomment the email sending code
   - Add your API key to environment variables

4. **Add to Vercel environment variables:**
   ```
   RESEND_API_KEY=your_api_key_here
   ```

## 🧪 Testing the API

### Test Bookings Endpoint:
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"service_type":"Bridal","bride_service":"Both Hair & Makeup"}'
```

### Test Quote Endpoint:
```bash
curl -X POST http://localhost:3000/api/quote \
  -H "Content-Type: application/json" \
  -d '{"service_type":"Bridal","bride_service":"Both Hair & Makeup","region":"Toronto/GTA"}'
```

## 📝 API Endpoints

### POST /api/bookings
Create a new booking
- Returns: `{ booking_id, unique_id, message }`

### GET /api/bookings?id={booking_id}
Get a specific booking

### GET /api/bookings
Get all bookings

### PUT /api/bookings?id={booking_id}
Update a booking

### POST /api/quote
Generate a price quote
- Returns: `{ quote_total, deposit_amount, remaining_amount, ... }`

### POST /api/bookings/send-confirmation
Send confirmation email
- Returns: `{ success, message, booking_id }`

## ⚠️ Important Notes

1. **Vercel KV Database**: Free tier has limits (256MB storage, 30k commands/month)
2. **Cold Starts**: First request might be slower (serverless functions)
3. **CORS**: Already configured to allow all origins
4. **Email**: Currently mocked - uncomment and configure in `send-confirmation.js`

## 🔗 Your API URLs

After deployment, your APIs will be available at:
- Production: `https://looksbyanum-multipledayform.vercel.app/api/*`
- Local: `http://localhost:3000/api/*`
