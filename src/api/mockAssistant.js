/**
 * Mock Assistant API for development
 * This simulates the streaming response for the AI Mentor
 */

import { shouldSearch, extractSearchTerms } from '@/utils/webSearchClassifier';
import { searchWeb, fetchPage, sanitizeQuery } from '@/utils/webSearchTools';

/**
 * Mock streaming response generator
 * @param {string} message - User message
 * @param {string} language - Response language
 * @param {boolean} webResearchEnabled - Whether web research is enabled
 * @returns {AsyncGenerator} - Streaming response
 */
async function* generateMockResponse(message, language = 'fa', webResearchEnabled = true) {
  const sanitizedQuery = sanitizeQuery(message);
  let usedWeb = false;
  let sources = [];

  // Check if web search is needed
  if (webResearchEnabled && shouldSearch(sanitizedQuery, language) === 'SEARCH') {
    usedWeb = true;
    
    // Send metadata first
    yield {
      type: 'metadata',
      usedWeb: true,
      sources: []
    };

    // Simulate web search delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock search results
    const mockSources = [
      {
        title: "Patent Search Results",
        url: "https://patents.google.com/search?q=" + encodeURIComponent(sanitizedQuery),
        content: "This is mock content from patent search results. In a real implementation, this would contain actual search results from patent databases and other reliable sources."
      },
      {
        title: "WIPO Patent Database",
        url: "https://patentscope.wipo.int/search/en/search.jsf",
        content: "Mock content from WIPO database. This would contain relevant patent information and intellectual property data."
      }
    ];

    sources = mockSources;

    // Update metadata with sources
    yield {
      type: 'metadata',
      usedWeb: true,
      sources: sources.map(s => ({ title: s.title, url: s.url }))
    };

    // Generate response with sources
    const response = language === 'fa' 
      ? `بر اساس جستجوی وب و منابع زیر، پاسخ شما:

منابع یافت شده:
${sources.map((source, index) => `[${index + 1}] ${source.title}`).join('\n')}

پاسخ: بر اساس اطلاعات موجود در منابع بالا، می‌توانم به سوال شما پاسخ دهم. این یک پاسخ نمونه است که در پیاده‌سازی واقعی، بر اساس محتوای واقعی منابع تولید می‌شود.

منابع:
${sources.map((source, index) => `[${index + 1}] ${source.title} - ${source.url}`).join('\n')}`
      : `Based on web search and the following sources:

Found sources:
${sources.map((source, index) => `[${index + 1}] ${source.title}`).join('\n')}

Answer: Based on the information available in the sources above, I can answer your question. This is a sample response that in a real implementation would be generated based on actual source content.

Sources:
${sources.map((source, index) => `[${index + 1}] ${source.title} - ${source.url}`).join('\n')}`;

    // Stream response content
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i < words.length - 1 ? ' ' : '');
      yield {
        type: 'content',
        content: word
      };
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  } else {
    // Use internal knowledge
    const response = language === 'fa'
      ? `سلام! من دستیار هوش مصنوعی شما هستم. بر اساس دانش داخلی خود، می‌توانم به سوال شما پاسخ دهم.

سوال شما: ${sanitizedQuery}

پاسخ: این یک پاسخ نمونه است که بر اساس دانش داخلی تولید شده است. در یک پیاده‌سازی واقعی، اینجا پاسخ دقیق و مفصل به سوال شما قرار می‌گیرد.

اگر نیاز به اطلاعات به‌روز دارید، لطفاً جستجوی وب را فعال کنید.`
      : `Hello! I'm your AI assistant. Based on my internal knowledge, I can answer your question.

Your question: ${sanitizedQuery}

Answer: This is a sample response generated based on internal knowledge. In a real implementation, a detailed and accurate answer to your question would be provided here.

If you need up-to-date information, please enable web search.`;

    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i < words.length - 1 ? ' ' : '');
      yield {
        type: 'content',
        content: word
      };
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  // Send final metadata
  yield {
    type: 'metadata',
    usedWeb,
    sources: sources.map(s => ({ title: s.title, url: s.url }))
  };
}

/**
 * Mock API handler for development
 * @param {Object} params - Request parameters
 * @returns {Promise<Response>} - Mock streaming response
 */
export async function handleMockAssistant({ message, language = 'fa', webResearchEnabled = true, conversationHistory = [] }) {
  try {
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          for await (const chunk of generateMockResponse(message, language, webResearchEnabled)) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
          }
          controller.close();
        } catch (error) {
          console.error('Mock assistant error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            error: 'An error occurred while processing your request'
          })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Mock API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default {
  handleMockAssistant,
  generateMockResponse
};

