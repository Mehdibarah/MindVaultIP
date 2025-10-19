/**
 * AI Handler for Vite Development
 * Simulates the API endpoint functionality
 */

import { detectIntent, shouldSearch, detectLanguage } from '@/utils/intent';
import { webSearch, fetchClean, pickDiverseSources, sanitizeQuery } from '@/utils/webtools';
import { checkRateLimit } from '@/utils/rateLimit';

// System prompt
const MVA_SYS = `You are AI Mentor for MindVaultIP.
- Be a general-purpose assistant first. Answer what the user asked—clearly, concisely, and in the user's language (fa/en).
- Use your internal knowledge first. If the question is time-sensitive, factual (who/when/how many/price/version/law/news/stats), or you're uncertain, do web research automatically.
- When using the web, ground every non-trivial claim in 2–4 reputable, diverse sources and cite them as [1], [2], ... Do not fabricate citations.
- Never default to patent/IP unless the user clearly asks. Only switch to IP mode when the intent contains IP/filing/ownership terms.
- If the question is ambiguous, ask ONE short clarification; otherwise give your best effort with transparent caveats.
- Keep answers compact by default; use bullet points when helpful; avoid fluff.`;

// Mock OpenAI client
class MockOpenAI {
  async chatCompletionsCreate(params) {
    const { messages, model, temperature, max_tokens } = params;
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
${content.includes('bitcoin') ? 'Current Bitcoin price: Based on sources [1] and [2]' : ''}
${content.includes('news') ? 'Latest news: According to sources [1] and [3]' : ''}
${content.includes('law') ? 'Current laws: Based on sources [2] and [3]' : ''}

این یک پاسخ نمونه است که در پیاده‌سازی واقعی بر اساس محتوای واقعی منابع تولید می‌شود.`;
    } else {
      // General response
      const isPersian = /[\u0600-\u06FF]/.test(content);
      if (isPersian) {
        response = `سلام! من دستیار هوش مصنوعی شما هستم. 

سوال شما: ${content}

پاسخ: این یک پاسخ نمونه است که بر اساس دانش داخلی تولید شده است. در پیاده‌سازی واقعی، اینجا پاسخ دقیق و مفصل به سوال شما قرار می‌گیرد.

اگر نیاز به اطلاعات به‌روز دارید، لطفاً سوال خود را به‌روز کنید.`;
      } else {
        response = `Hello! I'm your AI assistant. 

Your question: ${content}

Answer: This is a sample response generated based on internal knowledge. In a real implementation, a detailed and accurate answer to your question would be provided here.

If you need up-to-date information, please update your question.`;
      }
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

/**
 * Handle AI request
 * @param {Object} requestData - Request data
 * @returns {Promise<Object>} - Response data
 */
export async function handleAIRequest(requestData) {
  try {
    const { messages } = requestData;
    const userQ = messages?.[messages.length - 1]?.content || '';
    
    if (!userQ.trim()) {
      throw new Error('No message provided');
    }

    // Rate limiting (using a mock IP for development)
    const clientIP = 'dev-user-' + Math.random().toString(36).substr(2, 9);
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      throw new Error('Rate limit exceeded. Please try again later.');
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

      return {
        answer: response.choices[0].message.content,
        sources: [],
        usedWeb: false,
        intent,
        language
      };
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

      return {
        answer: response.choices[0].message.content + '\n\n(ممکن است اطلاعات به‌روز نباشد)',
        sources: [],
        usedWeb: false,
        intent,
        language
      };
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

    return {
      answer: response.choices[0].message.content,
      sources: picked.map((p, i) => ({
        id: i + 1,
        title: p.title,
        url: p.url
      })),
      usedWeb: true,
      intent,
      language
    };

  } catch (error) {
    console.error('AI Handler error:', error);
    throw error;
  }
}

export default {
  handleAIRequest
};
