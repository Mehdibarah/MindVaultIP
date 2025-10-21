# Supabase Chat Setup Guide

## Quick Setup

To enable the chat features, you need to set up Supabase and add the environment variables to your `.env` file.

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready (usually takes 1-2 minutes)

### Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (looks like `https://your-project.supabase.co`)
3. Copy your **anon public** key (long string starting with `eyJ...`)

### Step 3: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the contents of `docs/sql/chat_schema.sql`
3. Run the query to create the messages table

### Step 4: Add Environment Variables

Create a `.env` file in your project root (if it doesn't exist) and add:

```bash
# Add these lines to your .env file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your-project.supabase.co` and `your_anon_key_here` with your actual values.

### Step 5: Restart Development Server

```bash
npm run dev
```

## Testing Chat Features

1. Visit `/chat` for global chat
2. Visit `/chat/0x1234567890123456789012345678901234567890` for direct messages (replace with actual wallet address)

## Troubleshooting

- **"Chat Service Not Configured"**: Make sure your `.env` file has the correct Supabase credentials
- **"Wallet Required"**: Connect your MetaMask wallet to use chat features
- **Messages not appearing**: Check that the database schema was created correctly

## Security Notes

- The current setup uses basic RLS policies for demo purposes
- In production, implement proper authentication with SIWE (Sign-In with Ethereum)
- The anon key is safe to use in client-side code
