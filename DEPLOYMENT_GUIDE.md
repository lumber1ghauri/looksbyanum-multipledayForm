# 🚀 Official Deployment Guide

## ✅ Changes Made

1. **Email Service**: Enabled real email sending with Resend
2. **Backend API**: All booking saves now use official backend (`/api`)
3. **No Temporary Data**: All booking IDs and data are now persisted to Vercel KV

## 📋 Pre-Deployment Checklist

### 1. Install Resend Package
```bash
npm install resend
```

### 2. Set Up Vercel KV Database
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `looksbyanum-multipledayForm`
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **KV** (Key-Value Store)
6. Name it: `looksbyanum-bookings`
7. Click **Create**

### 3. Add Environment Variables to Vercel
Run these commands to add your environment variables:

```bash
# Add Resend API Key
vercel env add RESEND_API_KEY

# When prompted:
# - Value: re_KhWsHEAm_JVzP1tu1zXWYJDLEu9ULJBvy
# - Environment: Production, Preview, Development (select all)

# Add API URL (optional, but recommended)
vercel env add VITE_API_URL

# When prompted:
# - Value: /api
# - Environment: Production, Preview, Development (select all)
```

Or add them manually in Vercel Dashboard:
1. Go to your project settings
2. Click **Environment Variables**
3. Add:
   - Name: `RESEND_API_KEY`
   - Value: `re_KhWsHEAm_JVzP1tu1zXWYJDLEu9ULJBvy`
   - Environment: Production, Preview, Development

## 🚀 Deploy to Production

### Option 1: Automatic Deployment (Recommended)
Just push to GitHub - Vercel will auto-deploy:

```bash
git add .
git commit -m "Enable official backend and email service"
git push origin main
```

### Option 2: Manual Deployment
```bash
vercel --prod
```

## 🧪 Testing Locally

To test with the real backend locally:

```bash
# Start Vercel dev server (includes API endpoints)
vercel dev
```

Then open: http://localhost:3000

## 📧 Email Configuration

### Current Setup:
- **Service**: Resend
- **From Email**: `onboarding@resend.dev` (Resend's test domain)
- **Test Mode**: Works immediately, no domain verification needed

### For Production (Optional):
To use your own domain (e.g., `bookings@looksbyanum.com`):

1. Verify domain in Resend:
   - Go to [Resend Dashboard](https://resend.com/domains)
   - Add domain: `looksbyanum.com`
   - Add DNS records they provide
   - Wait for verification

2. Update `api/send-confirmation.js`:
   ```javascript
   from: 'Looks By Anum <bookings@looksbyanum.com>',
   ```

## 🎯 What's Now Official

### ✅ Backend API (`/api`)
- `/api/bookings` - Create/Read/Update bookings
- `/api/quote` - Generate price quotes
- `/api/send-confirmation` - Send emails

### ✅ Database (Vercel KV)
- All bookings persisted
- Real booking IDs (e.g., `BK-1731762345678`)
- No temporary data

### ✅ Email Service (Resend)
- Real emails sent to customers
- Dynamic content (names, prices, dates)
- Professional HTML templates

## 🐛 Troubleshooting

### CORS Errors
If you get CORS errors:
- Make sure you're using `vercel dev` locally (not `npm run dev`)
- Or deploy to production where API routes work automatically

### Email Not Sending
Check Vercel deployment logs:
```bash
vercel logs --follow
```

Look for:
- ✅ "Email sent successfully via Resend"
- ❌ "Resend email error" (check API key)

### Booking Not Saving
Check Vercel KV is connected:
1. Go to Vercel Dashboard > Storage
2. Verify KV database is linked to your project
3. Check environment variables are set

## 📊 Monitor Deployments

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs
```

### View Build Logs
Go to: https://vercel.com/lumber1ghauri/looksbyanum-multipledayform/deployments

## 🎉 Success Indicators

After deployment, you should see:
- ✅ No CORS errors in browser console
- ✅ "Booking saved: BK-xxxxxxxxx" toast message
- ✅ "Confirmation email sent!" toast message
- ✅ Email received in inbox with correct name/pricing
- ✅ No temporary booking IDs (no "TEMP-" prefix)

## 📞 Support

If issues persist:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Ensure Vercel KV is connected
4. Check Resend dashboard for email delivery status
