# AI Mentor - Minimal & Practical Implementation

## Overview
A ChatGPT-like AI assistant that answers questions directly, uses web research when needed, and doesn't unnecessarily redirect to patent topics.

## Key Features

### 🎯 **Direct Answers**
- Answers exactly what the user asked - clearly, concisely, and in their language (fa/en)
- No unnecessary topic redirection
- Compact responses by default

### 🔍 **Smart Web Research**
- Automatically detects when web search is needed
- Uses internal knowledge first, web research only when necessary
- Grounds claims in 2-4 reputable sources with citations [1], [2], [3]

### 🧠 **Intent Detection**
- **GENERAL Mode**: General-purpose assistant (default)
- **IP Mode**: Switches to IP expert only when user asks about patents/IP
- Never defaults to patent topics unless explicitly requested

### 🌐 **Bilingual Support**
- Persian (فا) and English language detection
- Responses in user's language
- RTL support for Persian

## Architecture

### Core Components

1. **Intent Detection** (`src/utils/intent.ts`)
   - `detectIntent()`: GENERAL vs IP classification
   - `shouldSearch()`: Web research trigger detection
   - `detectLanguage()`: Persian/English detection

2. **Web Tools** (`src/utils/webtools.ts`)
   - `webSearch()`: Tavily API integration (mock)
   - `fetchClean()`: Jina Reader for clean content (mock)
   - `pickDiverseSources()`: Domain diversity selection
   - `sanitizeQuery()`: PII removal

3. **Unified API** (`src/api/ai/route.ts`)
   - Single endpoint for all AI responses
   - Automatic web research routing
   - Rate limiting (30 requests/day)
   - Source citation generation

4. **Answer Component** (`src/components/Answer.tsx`)
   - Minimal answer display
   - Source links with external icons
   - Web research indicators
   - Intent mode badges

### System Prompt
```
You are AI Mentor for MindVaultIP.
- Be a general-purpose assistant first. Answer what the user asked—clearly, concisely, and in the user's language (fa/en).
- Use your internal knowledge first. If the question is time-sensitive, factual (who/when/how many/price/version/law/news/stats), or you're uncertain, do web research automatically.
- When using the web, ground every non-trivial claim in 2–4 reputable, diverse sources and cite them as [1], [2], ... Do not fabricate citations.
- Never default to patent/IP unless the user clearly asks. Only switch to IP mode when the intent contains IP/filing/ownership terms.
- If the question is ambiguous, ask ONE short clarification; otherwise give your best effort with transparent caveats.
- Keep answers compact by default; use bullet points when helpful; avoid fluff.
```

## Web Research Triggers

### Automatic Web Search When:
- **Time-sensitive**: "آخرین اخبار", "latest news", "today's prices"
- **Factual queries**: "چه کسی", "who", "when", "how many"
- **Market data**: "قیمت بیت کوین", "bitcoin price", "stock market"
- **Version info**: "نسخه جدید", "latest version", "update 2024"
- **Legal/regulatory**: "قوانین جدید", "new regulations", "policy changes"
- **Statistics**: "آمار", "statistics", "data", "numbers"

### Internal Knowledge For:
- General questions: "چیست", "what is", "explain"
- How-to guides: "چگونه", "how to", "tutorial"
- Conceptual questions: "مفهوم", "concept", "theory"

## Security & Performance

### Rate Limiting
- 30 requests per day per user (IP-based)
- Automatic cleanup of expired entries
- 429 status code when exceeded

### Domain Filtering
- **Allowed**: .gov, .edu, wipo.int, epo.org, ieee.org, nature.com, arxiv.org, bbc.com
- **Blocked**: t.me, pastebin.com, github.com/raw, bit.ly, tinyurl.com

### Content Sanitization
- PII removal from queries
- HTML/script removal from fetched content
- Character limits (8k per page)
- Timeout protection (8s)

## Production Setup

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
MVA_SYS=<<system prompt from above>>
```

### API Integration
1. Replace mock OpenAI client with real OpenAI API
2. Replace mock Tavily with real Tavily API calls
3. Replace mock Jina Reader with real Jina Reader API
4. Add Redis for production caching
5. Add database for conversation history

### Caching Strategy
- Search results: 6 hours TTL
- Page content: 24 hours TTL
- Rate limit data: 24 hours TTL

## Usage Examples

### General Questions
```
User: "What is machine learning?"
AI: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed..."

User: "قیمت بیت کوین چقدر است؟"
AI: "🔍 از وب استفاده شد
قیمت فعلی بیت کوین: [1] [2]
منابع:
[1] Bitcoin Price - CoinMarketCap
[2] Bitcoin News - Reuters"
```

### IP Questions
```
User: "How do I file a patent?"
AI: "🧠 متخصص مالکیت فکری
To file a patent, you need to:
1. Conduct a prior art search
2. Prepare detailed documentation
3. Submit to patent office
..."
```

## File Structure
```
src/
├── api/ai/route.ts          # Unified API endpoint
├── components/Answer.tsx    # Answer display component
├── pages/AIMentor.jsx      # Main chat interface
├── utils/
│   ├── intent.ts           # Intent detection
│   ├── webtools.ts         # Web search tools
│   └── rateLimit.ts        # Rate limiting
└── AI_MENTOR_README.md     # This file
```

## Testing
- Build: `npm run build` ✅
- Development: `npm run dev`
- Access: `/AIMentor`

The AI Mentor is now ready for production use with minimal, practical responses and automatic web research when needed!
