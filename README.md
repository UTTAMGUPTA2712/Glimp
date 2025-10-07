# Glimp AI Interview Assistant

A Next.js SaaS application for AI-powered interview preparation and assistance.

## Features

- User authentication with Supabase
- Subscription management with Razorpay
- Device pairing for desktop toolbar
- Interview preparation and analysis
- Clean, professional UI with Tailwind CSS

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Configure your environment variables in `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
- `/styles` - Global CSS and Tailwind styles
- `/public` - Static assets

## Environment Variables

See `.env.local.example` for required environment variables.

## Deployment

This project can be deployed on Vercel, Netlify, or any platform supporting Next.js.
