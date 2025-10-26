#!/bin/bash

# Awards Environment Setup Script
# This script helps you set up the required environment variables for awards functionality

echo "🏆 MindVaultIP Awards Environment Setup"
echo "======================================"
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to add awards configuration to it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

echo "📝 Setting up awards environment variables..."
echo ""

# Create or append to .env file
cat >> .env << 'EOF'

# Awards Configuration (REQUIRED for awards functionality)
# Get these from your Supabase project dashboard: Settings -> API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_BUCKET=awards

# Founder Address (for award issuance) - REPLACE WITH YOUR ACTUAL FOUNDER ADDRESS
VITE_FOUNDER_ADDRESS=0xYourFounderAddress

# Server-side Supabase Service Key (NEVER expose to client)
# Get this from your Supabase project: Settings -> API -> service_role key
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# Debug mode for awards (optional)
DEBUG_AWARDS=1
EOF

echo "✅ Awards environment variables added to .env file!"
echo ""
echo "🔧 Next steps:"
echo "1. Get your Supabase credentials:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project or use existing one"
echo "   - Go to Settings -> API"
echo "   - Copy your Project URL and anon public key"
echo "   - Copy your service_role key (for server-side operations)"
echo ""
echo "2. Update the .env file with your actual values:"
echo "   - VITE_SUPABASE_URL=https://your-project-id.supabase.co"
echo "   - VITE_SUPABASE_ANON_KEY=your-actual-anon-key"
echo "   - SUPABASE_SERVICE_KEY=your-actual-service-key"
echo "   - VITE_FOUNDER_ADDRESS=0xYourActualFounderAddress"
echo ""
echo "3. Set up the awards bucket in Supabase:"
echo "   - Go to Storage in your Supabase dashboard"
echo "   - Create a new bucket named 'awards'"
echo "   - Make it public"
echo "   - Set file size limit to 10MB"
echo ""
echo "4. Restart your development server:"
echo "   npm run dev"
echo ""
echo "🎉 Awards functionality should now work!"
