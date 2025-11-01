/**
 * AI Mentor API Endpoint
 * Unified endpoint for general and IP-specific responses with web research
 */

import { detectIntent, shouldSearch, detectLanguage } from '@/utils/intent';
import { webSearch, fetchClean, pickDiverseSources, sanitizeQuery } from '@/utils/webtools';
import { checkRateLimit } from '@/utils/rateLimit';

// System prompt from environment
const MVA_SYS = `You are AI Mentor for MindVaultIP.
- Be a general-purpose assistant first. Answer what the user asked—clearly, concisely, and in the user's language (fa/en).
- Use your internal knowledge first. If the question is time-sensitive, factual (who/when/how many/price/version/law/news/stats), or you're uncertain, do web research automatically.
- When using the web, ground every non-trivial claim in 2–4 reputable, diverse sources and cite them as [1], [2], ... Do not fabricate citations.
- Never default to patent/IP unless the user clearly asks. Only switch to IP mode when the intent contains IP/filing/ownership terms.
- If the question is ambiguous, ask ONE short clarification; otherwise give your best effort with transparent caveats.
- Keep answers compact by default; use bullet points when helpful; avoid fluff.`;

// Mock OpenAI client (replace with actual OpenAI in production)
class MockOpenAI {
  async chatCompletionsCreate(params: any) {
    const { messages } = params; // ✅ max_tokens removed - not used
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.content;
    
    // Mock response based on content
    let response = '';
    if (content.includes('منابع:')) {
      // Web research response
      response = `بر اساس منابع ارائه شده، پاسخ شما:

${content.includes('قیمت') ? 'قیمت فعلی: اطلاعات به‌روز از منابع [1] و [2]' : ''}
${content.includes('خبر') ? 'آخرین اخبار: بر اساس منابع [1] و [3]' : ''}
${content.includes('قانون') ? 'قوانین فعلی: طبق منابع [2] و [3]' : ''}

این یک پاسخ نمونه است که در پیاده‌سازی واقعی بر اساس محتوای واقعی منابع تولید می‌شود.`;
    } else {
      // General response
      response = `سلام! من دستیار هوش مصنوعی شما هستم. 

سوال شما: ${content}

پاسخ: این یک پاسخ نمونه است که بر اساس دانش داخلی تولید شده است. در پیاده‌سازی واقعی، اینجا پاسخ دقیق و مفصل به سوال شما قرار می‌گیرد.

اگر نیاز به اطلاعات به‌روز دارید، لطفاً سوال خود را به‌روز کنید.`;
    }
    
    return {
      choices: [{
        message: {
          content: response
        }
      }]
    };
  }
}

const openai = new MockOpenAI();

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const userQ: string = messages?.[messages.length - 1]?.content || '';
    
    if (!userQ.trim()) {
      return Response.json({ error: 'No message provided' }, { status: 400 });
    }

    // Rate limiting (using IP address as user identifier)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      return Response.json({
        error: 'Rate limit exceeded. Please try again later.',
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime
      }, { status: 429 });
    }

    const intent = detectIntent(userQ);
    const language = detectLanguage(userQ);
    const sanitizedQuery = sanitizeQuery(userQ);

    // Determine system role based on intent
    const role = intent === 'IP'
      ? 'Act as an IP/filing expert. Use structured outputs (Abstract, Claims draft) only if user asks.'
      : 'Act as a general-purpose assistant. Avoid patent talk unless asked.';

    const sys = `${MVA_SYS}\n${role}`;

    // Route 1: No web search needed
    if (!shouldSearch(sanitizedQuery)) {
      const response = await openai.chatCompletionsCreate({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          { role: 'system', content: sys },
          ...messages
        ]
      });

      return Response.json({
        answer: response.choices[0].message.content,
        sources: [],
        usedWeb: false,
        intent,
        language
      });
    }

    // Route 2: Web research needed
    const results = await webSearch(sanitizedQuery, 6);
    
    if (results.length === 0) {
      // Fallback to internal knowledge if no search results
      const response = await openai.chatCompletionsCreate({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          { role: 'system', content: sys },
          ...messages
        ]
      });

      return Response.json({
        answer: response.choices[0].message.content + '\n\n(ممکن است اطلاعات به‌روز نباشد)',
        sources: [],
        usedWeb: false,
        intent,
        language
      });
    }

    // Pick diverse sources and fetch content
    const picked = pickDiverseSources(results, 3);
    const pages = await Promise.all(picked.map(p => fetchClean(p.url)));

    // Create context from sources
    const ctx = picked.map((p, i) => 
      `[${i + 1}] ${p.title} — ${p.url}\n${pages[i]}`.slice(0, 3500)
    ).join('\n\n');

    const groundedUser = `
با تکیه «فقط» بر منابع زیر پاسخ دقیق و کوتاه بده. ادعاها را با [n] استناد بده. اگر منابع اختلاف دارند، بگو.
منابع:
${ctx}

پرسش کاربر: ${sanitizedQuery}
پاسخ:`;

    const response = await openai.chatCompletionsCreate({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 900,
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: groundedUser }
      ]
    });

    return Response.json({
      answer: response.choices[0].message.content,
      sources: picked.map((p, i) => ({
        id: i + 1,
        title: p.title,
        url: p.url
      })),
      usedWeb: true,
      intent,
      language
    });

  } catch (error) {
    console.error('AI API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
