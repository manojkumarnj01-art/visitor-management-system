# Barani Hydraulics - Visitor Management System

This project is a Corporate Visitor Management System built with HTML, CSS, JavaScript, Vite, and Supabase.

## Environment Variables Configuration

To run this application, the following environment variables must be configured.

### Local Development
Create a `.env` file in the root directory (based on `.env.example`) and supply:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

### Production Deployment (Vercel)
You must define these exact Environment Variables in your Vercel Project Settings:

1. **`VITE_SUPABASE_URL`**: The API URL of your Supabase project (e.g. `https://example.supabase.co`).
2. **`VITE_SUPABASE_ANON_KEY`**: The anon/public API key of your Supabase project.

If these environment variables are missing, the application will show a console warning and gracefully fall back to **Offline Local Mock Mode**, allowing all local VMS functions to continue running without crash/runtime errors.

## Build and Deployment

### Install dependencies
```bash
npm install
```

### Run locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```
The output directory will be `dist/`.
