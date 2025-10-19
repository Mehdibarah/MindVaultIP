# Feature Flags Configuration

## Overview
Feature flags allow you to enable/disable features without code changes. This is useful for:
- Gradual feature rollouts
- A/B testing
- Emergency feature disabling
- Development environment control

## Environment Variables

Add these to your `.env` file:

```env
# AI Mentor - Intelligent chat assistant for programming and career advice
VITE_FEATURE_AI_MENTOR=false

# Messages - Private 1:1 chat between wallet addresses  
VITE_FEATURE_MESSAGES=true

# Marketplace - Trading platform for intellectual property
VITE_FEATURE_MARKETPLACE=true

# Expert Dashboard - Specialized interface for expert reviewers
VITE_FEATURE_EXPERT_DASHBOARD=true

# Admin Panel - Administrative interface for platform management
VITE_FEATURE_ADMIN_PANEL=true
```

## Usage in Code

```javascript
import { FEATURE_AI_MENTOR, isFeatureEnabled } from '@/utils/featureFlags';

// Direct flag check
if (FEATURE_AI_MENTOR) {
  // Show AI Mentor features
}

// Dynamic flag check
if (isFeatureEnabled('AI_MENTOR')) {
  // Show AI Mentor features
}
```

## Current Status

- ✅ **AI Mentor**: DISABLED (set to false)
- ✅ **Messages**: ENABLED (set to true)
- ✅ **Marketplace**: ENABLED (set to true)
- ✅ **Expert Dashboard**: ENABLED (set to true)
- ✅ **Admin Panel**: ENABLED (set to true)

## How to Enable/Disable Features

1. **Edit `.env` file**:
   ```env
   VITE_FEATURE_AI_MENTOR=true  # Enable AI Mentor
   ```

2. **Restart development server**:
   ```bash
   npm run dev
   ```

3. **Feature will be available** in navigation and routing

## Implementation Details

- Feature flags are checked at build time and runtime
- Disabled features are completely hidden from navigation
- Direct route access to disabled features redirects to home page
- Feature flags are included in bundle for client-side checks
- No server restart needed for flag changes (just dev server restart)
