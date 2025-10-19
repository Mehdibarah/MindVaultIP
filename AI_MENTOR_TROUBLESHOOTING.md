# AI Mentor Troubleshooting Guide

## Issues Fixed

### ✅ **Main Issue: API Endpoint Not Working**
**Problem**: The AI Mentor was trying to call `/api/ai` which doesn't exist in a Vite project.

**Solution**: Created `src/api/aiHandler.js` that provides the same functionality locally.

### ✅ **Build Issues**
**Problem**: TypeScript files (.ts) causing import issues.

**Solution**: All utility files are now properly configured and building successfully.

## Current Status

### ✅ **Working Features**
- ✅ Intent detection (GENERAL vs IP)
- ✅ Web search triggers
- ✅ Language detection (Persian/English)
- ✅ Mock AI responses
- ✅ Source citations
- ✅ Rate limiting
- ✅ Build process
- ✅ Development server

### 🔧 **Mock Implementation**
The current implementation uses mock responses for development. To make it production-ready:

1. **Replace Mock OpenAI** with real OpenAI API
2. **Replace Mock Web Search** with real Tavily API
3. **Replace Mock Page Fetching** with real Jina Reader API
4. **Add Redis** for caching and rate limiting

## Testing the AI Mentor

### 1. **Access the Page**
- Navigate to `/AIMentor` in your browser
- You should see the chat interface

### 2. **Test Basic Functionality**
Try these test questions:

**General Questions (Internal Knowledge):**
- "What is artificial intelligence?"
- "How does machine learning work?"
- "چیست هوش مصنوعی؟"

**Web Research Triggers:**
- "Bitcoin price today"
- "Latest news about AI"
- "قیمت بیت کوین امروز"
- "آخرین اخبار هوش مصنوعی"

**IP Questions:**
- "How to file a patent?"
- "What is intellectual property?"
- "ثبت اختراع چگونه است؟"

### 3. **Expected Behavior**
- **General questions**: Should get internal knowledge responses
- **Web triggers**: Should show "🔍 از وب استفاده شد" and mock sources
- **IP questions**: Should show "🧠 متخصص مالکیت فکری" badge
- **Language**: Should respond in the same language as the question

## Common Issues & Solutions

### Issue 1: "Failed to get response"
**Cause**: API handler not loading properly
**Solution**: Check browser console for import errors

### Issue 2: No response at all
**Cause**: JavaScript error in the component
**Solution**: Check browser console for errors

### Issue 3: Build fails
**Cause**: Import/export issues
**Solution**: Run `npm run build` to see specific errors

### Issue 4: Rate limit exceeded
**Cause**: Too many requests in development
**Solution**: The rate limiter resets every 24 hours, or restart the dev server

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check for linting errors
npm run lint

# Test AI functionality (in browser console)
import { testAI } from './src/utils/testAI.js'
testAI()
```

## File Structure

```
src/
├── api/
│   └── aiHandler.js          # Main AI handler (replaces API endpoint)
├── components/
│   └── Answer.tsx            # Answer display component
├── pages/
│   └── AIMentor.jsx          # Main chat interface
├── utils/
│   ├── intent.ts             # Intent detection
│   ├── webtools.ts           # Web search tools
│   ├── rateLimit.ts          # Rate limiting
│   └── testAI.js             # Test utilities
└── AI_MENTOR_TROUBLESHOOTING.md
```

## Next Steps for Production

1. **Add Real APIs**:
   ```javascript
   // Replace in aiHandler.js
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   ```

2. **Add Environment Variables**:
   ```env
   OPENAI_API_KEY=your_key_here
   TAVILY_API_KEY=your_key_here
   ```

3. **Add Redis Caching**:
   ```javascript
   import Redis from 'ioredis';
   const redis = new Redis(process.env.REDIS_URL);
   ```

4. **Add Error Monitoring**:
   ```javascript
   // Add Sentry or similar
   import * as Sentry from '@sentry/react';
   ```

The AI Mentor should now be working correctly in development mode with mock responses!
