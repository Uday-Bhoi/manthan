# Manthan 2026 - College Tech Fest Website

A premium, high-performance web platform designed for the **Manthan 2026** College Tech Fest. This application handles everything from event discovery to secure registration and digital ticket generation.

![Manthan Logo](public/manthan_final_logo.png)

## 🚀 Features

-   **Cinematic UI/UX**: High-end visuals using Cormorant Unicase typography and global video backgrounds.
-   **Dynamic Event Catalog**: Browse technical, cultural, and sports events with detailed descriptions and rules.
-   **Multi-Step Registration**: A seamless, user-friendly registration flow (Basic Info → Event Selection → Payment).
-   **Razorpay Integration**: Secure payment processing with server-side validation and signature verification.
-   **Digital Entry Pass**: Automatic generation of unique Entry Passes with QR codes for event check-ins.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop with premium aesthetics and Framer Motion animations.
-   **Admin Dashboard**: Manage registrations, check-in participants, and view real-time statistics.

## 🛠️ Tech Stack

-   **Core**: Next.js 14 (App Router), TypeScript, Tailwind CSS
-   **Typography**: Cormorant Unicase (Google Fonts)
-   **Animations**: Framer Motion, Lucide React (Icons)
-   **Backend**: Next.js API Routes (Serverless)
-   **Database**: Supabase (PostgreSQL)
-   **Payments**: Razorpay SDK
-   **QR Generation**: `qrcode` library

## 📥 Installation & Setup

Follow these steps to get the project running locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/Uday-Bhoi/manthan.git
cd manthan
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following keys from your Supabase and Razorpay accounts:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. Database Schema
Ensure your Supabase database has the required tables. You can use the schema provided in:
`src/lib/supabase/schema.sql`

### 5. Run the Project
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `src/app`: Next.js pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions, constants, and validation schemas.
- `public`: Static assets (images, videos).

## ⚠️ Important Notes

-   **Background Video**: The main cinematic video `public/theme2.mp4` adds depth to the experience. Ensure this file is present in your local `public/` folder.
-   **Typography**: The font **Cormorant Unicase** is imported globally via Google Fonts in `src/app/globals.css`.
-   **Payment Mode**: By default, the payment integration is set up for Razorpay. Use Test Keys for development and Live Keys for production.

---

Built with ❤️ for Manthan 2026 by BVIMIT Team.
