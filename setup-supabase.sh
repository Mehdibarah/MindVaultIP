#!/bin/bash

# Supabase Chat Setup Script
echo "🚀 MindVaultIP Chat Setup"
echo "========================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "📝 .env file already exists"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Get your Project URL and anon key from Settings → API"
echo "3. Run the SQL schema from docs/sql/chat_schema.sql in your Supabase SQL Editor"
echo "4. Update your .env file with:"
echo "   VITE_SUPABASE_URL=https://your-project.supabase.co"
echo "   VITE_SUPABASE_ANON_KEY=your_anon_key_here"
echo ""
echo "📖 For detailed instructions, see SUPABASE_SETUP.md"
echo ""
echo "🔄 After updating .env, restart your dev server:"
echo "   npm run dev"
