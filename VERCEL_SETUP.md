# 🚀 Official Vercel Production Setup Guide

## ⚠️ IMPORTANT: You MUST complete these steps for the app to work!

The 500 error you're seeing is because **Vercel KV database is not set up yet**. Follow these steps exactly:

---

## Step 1: Set Up Vercel KV Database (REQUIRED)

### 1.1 Go to Vercel Dashboard
1. Open: https://vercel.com/lumber1ghauri/looksbyanum-multipledayform
2. Click on the **Storage** tab in the top menu

### 1.2 Create KV Database
1. Click **Create Database**
2. Select **KV** (Key-Value Store)
3. Give it a name: `looksbyanum-bookings-db`
4. Click **Create**

### 1.3 Connect to Your Project
1. After creation, you'll see the database page
2. Click **Connect to Project**
3. Select your project: `looksbyanum-multipledayform`
4. Select environments: ✅ **Production**, ✅ **Preview**, ✅ **Development**
5. Click **Connect**

**✅ This automatically adds KV environment variables to your project!**

The following variables are auto-added:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

---

## Step 2: Add Resend API Key (REQUIRED for emails)

### 2.1 Go to Environment Variables
1. In your Vercel project dashboard: https://vercel.com/lumber1ghauri/looksbyanum-multipledayform
2. Click **Settings** tab
3. Click **Environment Variables** in the left sidebar

### 2.2 Add RESEND_API_KEY
1. Click **Add New** button
2. Fill in the form:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_KhWsHEAm_JVzP1tu1zXWYJDLEu9ULJBvy`
   - **Environment**: Select ALL three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save**

### 2.3 Add VITE_API_URL (Optional but recommended)
1. Click **Add New** button again
2. Fill in:
   - **Name**: `VITE_API_URL`
   - **Value**: `/api`
   - **Environment**: Select ALL three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save**

---

## Step 3: Redeploy to Apply Changes

After adding environment variables and KV database, you MUST redeploy:

### Option A: Trigger Redeploy from Dashboard
1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. ✅ Check "Use existing Build Cache"
5. Click **Redeploy**

### Option B: Push a New Commit (Recommended)
Since we just pushed code, wait 2-3 minutes for deployment to complete.
Check deployment status at: https://vercel.com/lumber1ghauri/looksbyanum-multipledayform/deployments

---

## Step 4: Verify Setup

### 4.1 Check Environment Variables
1. Go to **Settings** → **Environment Variables**
2. You should see:
   - ✅ `RESEND_API_KEY` (shown as `re_***...`)
   - ✅ `VITE_API_URL` (shown as `/api`)
   - ✅ `KV_REST_API_URL` (auto-added by KV)
   - ✅ `KV_REST_API_TOKEN` (auto-added by KV)
   - ✅ `KV_URL` (auto-added by KV)

### 4.2 Check Deployment Logs
1. Go to **Deployments** tab
2. Click on the latest deployment (should say "Ready")
3. Click **View Function Logs**
4. Test by filling out the form on your live site
5. You should see:
   - ✅ "Booking created: BK-xxxxx"
   - ✅ "Email sent successfully via Resend"
   - ❌ NO "500 Internal Server Error"
   - ❌ NO "KV_REST_API_URL is not defined"

---

## Step 5: Test the Live Site

1. Open: https://looksbyanum-multipleday-form.vercel.app/
2. Fill out the booking form completely
3. After filling Contact Details, you should see:
   - ✅ "Booking saved: BK-xxxxx" toast notification
   - ✅ Form proceeds to Quote Review page
   - ✅ Both pricing packages displayed
   - ✅ "Confirmation email sent!" notification
4. Check your email inbox:
   - ✅ Email received with YOUR actual name
   - ✅ Email shows YOUR actual pricing (not hardcoded)
   - ✅ All booking details are correct

---

## 🎯 What Each Component Does

### Vercel KV Database
- **Purpose**: Store all booking data permanently
- **Used by**: `/api/bookings` endpoint
- **Stores**: Customer info, service details, pricing, booking IDs
- **Why needed**: Without it, you get 500 errors when saving bookings

### Resend API Key
- **Purpose**: Send confirmation emails to customers
- **Used by**: `/api/send-confirmation` endpoint
- **Sends**: Beautiful HTML emails with booking details and pricing
- **Why needed**: Without it, customers won't receive confirmation emails

### VITE_API_URL
- **Purpose**: Tell frontend where to find backend API
- **Value**: `/api` (relative path to Vercel serverless functions)
- **Why needed**: Ensures API calls go to correct endpoints

---

## 🐛 Troubleshooting

### Still Getting 500 Error?

**Check 1: Is KV database connected?**
- Go to Storage tab
- You should see the KV database listed
- Click on it → should show "Connected to looksbyanum-multipledayform"

**Check 2: Are environment variables set?**
- Go to Settings → Environment Variables
- Verify all 5 variables are present (3 from KV, 2 manual)

**Check 3: Did you redeploy after adding variables?**
- Environment variable changes require a redeploy
- Go to Deployments → Redeploy latest

**Check 4: View error logs**
- Go to Deployments → Latest deployment → View Function Logs
- Look for specific error messages
- Common errors:
  - "KV_REST_API_URL is not defined" → KV not connected
  - "Resend API key invalid" → Check RESEND_API_KEY value

### Email Not Sending?

**Check Resend Dashboard:**
1. Go to: https://resend.com/emails
2. Login with your Resend account
3. Check recent emails - should see attempts
4. If failed, check error message

**Verify API Key:**
- Make sure you copied the FULL key: `re_KhWsHEAm_JVzP1tu1zXWYJDLEu9ULJBvy`
- No extra spaces before/after

### Booking Not Saving?

**Check KV Connection:**
1. Go to Storage tab in Vercel
2. Click on your KV database
3. Click "Data Browser" tab
4. After testing, you should see keys like:
   - `booking:BK-1731762345678`
   - `bookings:all`

---

## 📞 Next Steps After Setup

Once everything is working:

1. **Test thoroughly:**
   - Single-day Bridal booking
   - Single-day Semi-Bridal booking
   - Single-day Non-Bridal booking
   - Multi-day booking

2. **Verify email content:**
   - Check all dynamic fields are filled correctly
   - Both pricing packages show correct amounts
   - Dates and times are accurate

3. **Monitor for a few days:**
   - Check Vercel logs for any errors
   - Monitor Resend dashboard for email delivery
   - Verify bookings are saved in KV database

4. **Optional: Add custom domain for emails:**
   - Currently using `onboarding@resend.dev` (Resend test domain)
   - To use `bookings@looksbyanum.com`:
     - Add domain in Resend dashboard
     - Verify DNS records
     - Update `api/send-confirmation.js` from address

---

## ✅ Success Checklist

Before considering setup complete, verify:

- [ ] Vercel KV database created and connected
- [ ] All 5 environment variables present in Vercel dashboard
- [ ] Latest deployment shows "Ready" status
- [ ] Form submission creates booking (no 500 error)
- [ ] Toast shows "Booking saved: BK-xxxxx"
- [ ] Form proceeds to Quote Review page
- [ ] Confirmation email received in inbox
- [ ] Email contains correct name and pricing
- [ ] No errors in Vercel function logs
- [ ] Bookings visible in KV Data Browser

**Once all checked, your production app is LIVE! 🎉**
