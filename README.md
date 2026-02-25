# Manthan - College Tech Fest Application

## Environment Variables (create .env.local)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Setup

1. `npm install` (set npm cache to E: if C: is low: `npm config set cache E:\npm-cache`)
2. Create Supabase project and run the SQL from `src/lib/supabase/schema.sql`
3. Add environment variables to `.env.local`
4. `npm run dev`

## Deployment

Deploy on Vercel with environment variables configured.
