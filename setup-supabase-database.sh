#!/bin/bash

echo "🚀 Supabase Database Setup for MindVaultIP"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please run ./setup-env.sh first"
    exit 1
fi

# Get Supabase URL from .env
SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
PROJECT_ID=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|\.supabase\.co||')

echo "📋 Your Supabase Project Details:"
echo "   Project ID: $PROJECT_ID"
echo "   URL: $SUPABASE_URL"
echo ""

echo "🔧 Next Steps:"
echo "=============="
echo ""
echo "1. Go to your Supabase project dashboard:"
echo "   https://supabase.com/dashboard/project/$PROJECT_ID"
echo ""
echo "2. Click on 'SQL Editor' in the left sidebar"
echo ""
echo "3. Copy and paste the following SQL script:"
echo ""
echo "   (The script is in: supabase-awards-bucket-setup.sql)"
echo ""
echo "4. Click 'Run' to execute the script"
echo ""
echo "5. After running the script, test your setup:"
echo "   node diagnose-storage.js"
echo ""

# Show the SQL script content
echo "📄 SQL Script Content:"
echo "======================"
echo ""
cat supabase-awards-bucket-setup.sql
echo ""
echo "=========================================="
echo "Copy the above SQL script and run it in your Supabase SQL Editor"
echo "=========================================="
