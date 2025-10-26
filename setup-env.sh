#!/bin/bash

# MindVaultIP Environment Setup Script
# This script helps you set up the required environment variables

echo "🚀 MindVaultIP Environment Setup"
echo "================================="
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

echo "📝 Creating .env file..."
echo ""

# Create .env file
cat > .env << 'EOF'
# MindVaultIP Environment Configuration
# Update the values below with your actual credentials

# Contract Configuration
VITE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_PAYMENT_ADDRESS=0x63A8000bD167183AA43629d7C315d0FCc14B95ea
VITE_NETWORK=base
VITE_CHAIN_ID=8453

# RPC URL for ethers.js provider
VITE_RPC_URL=https://mainnet.base.org

# Web3Modal Configuration
VITE_WC_PROJECT_ID=1279cd8b19e9ce4ba19e81e410bc4552

# AI Mentor Configuration (optional)
VITE_TAVILY_API_KEY=your_tavily_api_key_here
VITE_JINA_API_KEY=your_jina_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (REQUIRED for storage and chat)
# Get these from your Supabase project dashboard: Settings -> API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_BUCKET=awards

# Founder Address (for award issuance)
VITE_FOUNDER_ADDRESS=0xYourFounderAddress

# Debug mode (optional)
VITE_DEBUG=1
EOF

echo "✅ .env file created successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Get your Supabase credentials:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project or use existing one"
echo "   - Go to Settings -> API"
echo "   - Copy your Project URL and anon public key"
echo ""
echo "2. Update the .env file with your actual values:"
echo "   - VITE_SUPABASE_URL=https://your-project-id.supabase.co"
echo "   - VITE_SUPABASE_ANON_KEY=your-actual-anon-key"
echo "   - VITE_FOUNDER_ADDRESS=0xYourWalletAddress"
echo ""
echo "3. Run the Supabase setup:"
echo "   - Go to your Supabase project SQL editor"
echo "   - Run the contents of supabase-awards-bucket-setup.sql"
echo ""
echo "4. Start the development server:"
echo "   npm run dev"
echo ""
echo "📚 For detailed instructions, see SUPABASE_STORAGE_SETUP.md"
