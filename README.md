## LBA Booking Frontend (React + Vite)

This repository is the frontend for a booking and payments application (Looks By Anum). It's a React + Vite single-page app that implements a multi-step booking flow, quote generation, artist selection and scheduling, contract review/signature, and payment handling (Stripe and Interac e-transfer). The frontend talks to a backend API for persistence, quote calculation and payment/session creation.

This README documents how to run the app locally and lists the API endpoints that the frontend calls (useful when wiring the backend or testing integrations).

## Quick start

1. Install dependencies

```powershell
npm install
```

2. Provide environment variables (see next section).

3. Run the dev server

```powershell
npm run dev
```

Open http://localhost:5173 (or the port Vite reports) to view the app.

## Required environment variables

- VITE_API_URL - Base URL for backend API (example: https://api.example.com/api)
- VITE_STRIPE_PUBLISHABLE - Stripe publishable key used by stripe-js
- VITE_FRONTEND_URL - (optional) frontend base url used for redirects in some flows

Set these in a .env file or your system environment when running locally (Vite exposes import.meta.env.VITE_* variables).

## Overview of frontend responsibilities

- Multi-step booking form and validation (react-hook-form + zod)
- Create/update bookings and request email confirmations
- Request quote calculations from backend
- Select artist, date/time and service address
- Contract review and digital signature capture (typed + canvas)
- Payment processing using Stripe and Interac flows
- Upload Interac screenshots for admin verification

## API endpoints used by the frontend

All endpoints below are relative to the configured API base URL (VITE_API_URL). The list was collected from the frontend source (components under `src/`).

Note: request/response shapes should be confirmed with the backend API docs. The descriptions below summarize how the frontend uses each endpoint.

### Config

- GET /config
	- Purpose: Fetch configuration flags/data for the frontend.
	- Used by: `src/App.jsx` (initial config load)

### Bookings (lead capture, lookup, update)

- GET /bookings/lookup/:bookingId
	- Purpose: Load a booking by public id for remaining payments or editing.
	- Used by: `src/App.jsx` (remaining payment / edit flows), `RemainingPayment` components

- POST /bookings
	- Purpose: Create a new booking/lead. Frontend posts collected form data here when user reaches contact step or final booking submission.
	- Used by: `src/App.jsx`, `PaymentStep.jsx` (save/ensure booking before creating Stripe session)

- PUT /bookings/:bookingId
	- Purpose: Update full booking (edit flow).
	- Used by: `src/App.jsx` (edit booking updates)

- PATCH /bookings/:bookingId/pricing
	- Purpose: Update booking pricing (quote) after backend returns calculated quote.
	- Used by: `src/App.jsx` (after POST /quote when booking exists)

- PATCH /bookings/:bookingId/details
	- Purpose: Update selected artist, service_date/time, venue/address, signature, terms_agreed and pricing details prior to payment.
	- Used by: `src/App.jsx` (handlePayment before creating Stripe session)

- POST /bookings/lookup-by-email
	- Purpose: Lookup bookings by client email (used in remaining payment search forms).
	- Used by: `src/components/RemainingPayment.jsx` and related components

- PUT /bookings/:bookingId/address
	- Purpose: Update service address for a booking (used in quote page flows).
	- Used by: `src/components/QuotePage.jsx`

- PUT /bookings/:bookingId/update-pricing
	- Purpose: Persist pricing changes from quote page.
	- Used by: `src/components/QuotePage.jsx`

- PUT /bookings/:bookingId/quote-selections
	- Purpose: Save user selections for quote items (used inside QuotePage editing flows).
	- Used by: `src/components/QuotePage.jsx`

- POST /bookings/send-confirmation
	- Purpose: Send a confirmation/lead email with next steps / quote link. The frontend sends booking data to trigger an email with a link back to the quote flow.
	- Used by: `src/App.jsx` (when reaching contract review / lead capture step)

### Quotes / Pricing

- POST /quote
	- Purpose: Send the current form data to backend price engine and receive calculated quote (quote_total, deposit_amount, remaining_amount). The frontend stores the result and displays a Quote Review.
	- Used by: `src/App.jsx`, `QuotePage.jsx`

- GET /quote/:bookingId
	- Purpose: Retrieve quote details / pricing for an existing booking (used by the QuotePage and Interac flows to display amounts).
	- Used by: `src/components/QuotePage.jsx`, `InteracUpload.jsx`, `RemainingPayment.jsx`

### Stripe (payments)

- POST /stripe/create-checkout-session
	- Purpose: Create a Stripe Checkout session for deposit/payment. The frontend posts booking (or saved booking) info and the backend returns a checkout URL to redirect the client to.
	- Used by: `src/App.jsx` (handlePayment), `src/components/PaymentStep.jsx`, `RemainingPayment` flows

- POST /stripe/create-remaining-payment-session
	- Purpose: Create a Stripe Checkout session for a remaining / final payment using an existing booking id.
	- Used by: `src/App.jsx` (remaining-payment path), `RemainingPayment.jsx` (create remaining payment session)

### Interac (e‑transfer and identity verification)

- GET /interac/auth-url?bookingId={id}
	- Purpose: Request an Interac verification/authorization URL for a booking so the user can authenticate via Interac Hub (OAuth-style). Backend returns an authUrl to redirect the client to.
	- Used by: `src/components/PaymentStep.jsx` (handleInteracVerification)

- POST /interac/callback
	- Purpose: Exchange the Interac authorization code (callback) for verification result and user info. The frontend's `InteracCallback` posts the code to this endpoint.
	- Used by: `src/components/InteracCallback.jsx`

- GET /interac/payment-info/:bookingId
	- Purpose: Retrieve Interac payment instructions (recipient email, amounts, previously uploaded screenshots and verification status) for a booking.
	- Used by: `src/components/InteracUpload.jsx`, `RemainingPayment.jsx`

- GET /interac/check-remaining/:bookingId
	- Purpose: Check whether a booking has a remaining payment due (used to gate Interac upload flow).
	- Used by: `src/components/InteracUpload.jsx`

- POST /interac/upload-screenshot
	- Purpose: Upload a screenshot image (multipart/form-data) for an Interac e-transfer so admin can manually verify payment.
	- Used by: `src/components/InteracUpload.jsx`, `RemainingPayment.jsx`

### Other notes

- The frontend expects the backend to return JSON objects containing fields like `booking_id`, `unique_id`, `pricing` (quote_total, deposit_amount, remaining_amount), `payment_status`, and `url` for Stripe sessions.
- After Stripe Checkout completes, Stripe will redirect to a frontend route (e.g. `/success`) with URL params such as `session_id` and `booking_id`. The frontend reads these and shows success UI.

## Where these endpoints are used in the codebase (quick map)

- Main booking flow and lead capture: `src/App.jsx`
- Payment UI and session creation: `src/components/PaymentStep.jsx`
- Interac upload and verification: `src/components/InteracUpload.jsx`, `src/components/InteracCallback.jsx`
- Quote display & editing: `src/components/QuotePage.jsx`, `src/components/QuoteReview.jsx`
- Remaining-payment lookup flows: `src/components/RemainingPayment.jsx`

## Next steps / tips for backend wiring

- Confirm request/response schemas with backend developers and add an API spec (OpenAPI/Swagger) to this repo or a shared docs repo.
- Provide a small mock server (json-server or similar) that implements the endpoints above to use during frontend development and testing.

If you want, I can now add a short example payload for the most important endpoints (POST /bookings, POST /quote, POST /stripe/create-checkout-session) or inspect additional components (AdminPanel, EditBookingPage, RemainingPayment, QuotePage) to refine the API shapes.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
