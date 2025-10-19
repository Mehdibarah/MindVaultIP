import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Plus, Trash2, MessageSquare } from 'lucide-react';
import './AIMentor.css';

const AIMentor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
  const messagesEndRef = useRef(null);

  // Translations
  const t = {
    en: {
      title: 'AI Mentor',
      subtitle: 'Your intelligent learning companion',
      welcomeTitle: 'Hello! I\'m your AI Mentor 👋',
      welcomeMessage: 'I can help you with programming, career advice, learning strategies, and personal growth. What would you like to explore today?',
      placeholder: 'Type your message here...',
      send: 'Send',
      newChat: 'New Chat',
      suggestions: {
        programming: 'How can I improve my programming skills?',
        project: 'Suggest a good learning project',
        resume: 'Help me write a strong resume',
        career: 'Career advice for developers'
      },
      thinking: 'Thinking...',
    error: 'Sorry, I encountered an error. Please try again.',
      clearChat: 'Clear Chat'
  },
  fa: {
      title: 'مربی هوش مصنوعی',
      subtitle: 'همراه هوشمند یادگیری شما',
      welcomeTitle: 'سلام! من مربی هوش مصنوعی شما هستم 👋',
      welcomeMessage: 'می‌توانم در برنامه‌نویسی، مشاوره شغلی، استراتژی‌های یادگیری و رشد شخصی به شما کمک کنم. امروز چه چیزی را می‌خواهید کشف کنید؟',
      placeholder: 'پیام خود را اینجا بنویسید...',
      send: 'ارسال',
      newChat: 'مکالمه جدید',
      suggestions: {
        programming: 'چطور مهارت برنامه‌نویسی خودم را بهبود بدهم؟',
        project: 'یک پروژه مناسب برای یادگیری پیشنهاد بده',
        resume: 'کمکم کن یک رزومه قوی بنویسم',
        career: 'مشاوره شغلی برای توسعه‌دهندگان'
      },
      thinking: 'در حال فکر کردن...',
      error: 'متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.',
      clearChat: 'پاک کردن چت'
    },
    es: {
      title: 'Mentor de IA',
      subtitle: 'Tu compañero inteligente de aprendizaje',
      welcomeTitle: '¡Hola! Soy tu Mentor de IA 👋',
      welcomeMessage: 'Puedo ayudarte con programación, consejos de carrera, estrategias de aprendizaje y crecimiento personal. ¿Qué te gustaría explorar hoy?',
      placeholder: 'Escribe tu mensaje aquí...',
      send: 'Enviar',
      newChat: 'Nueva Conversación',
      suggestions: {
        programming: '¿Cómo puedo mejorar mis habilidades de programación?',
        project: 'Sugiere un buen proyecto de aprendizaje',
        resume: 'Ayúdame a escribir un currículum fuerte',
        career: 'Consejos de carrera para desarrolladores'
      },
      thinking: 'Pensando...',
      error: 'Lo siento, encontré un error. Por favor intenta de nuevo.',
      clearChat: 'Limpiar Chat'
  },
  fr: {
      title: 'Mentor IA',
      subtitle: 'Votre compagnon d\'apprentissage intelligent',
      welcomeTitle: 'Bonjour ! Je suis votre Mentor IA 👋',
      welcomeMessage: 'Je peux vous aider avec la programmation, les conseils de carrière, les stratégies d\'apprentissage et le développement personnel. Que souhaitez-vous explorer aujourd\'hui ?',
      placeholder: 'Tapez votre message ici...',
      send: 'Envoyer',
      newChat: 'Nouvelle Conversation',
      suggestions: {
        programming: 'Comment puis-je améliorer mes compétences en programmation ?',
        project: 'Suggérez un bon projet d\'apprentissage',
        resume: 'Aidez-moi à écrire un CV solide',
        career: 'Conseils de carrière pour les développeurs'
      },
      thinking: 'Réflexion...',
      error: 'Désolé, j\'ai rencontré une erreur. Veuillez réessayer.',
      clearChat: 'Effacer le Chat'
  },
  ar: {
      title: 'مرشد الذكاء الاصطناعي',
      subtitle: 'رفيقك الذكي في التعلم',
      welcomeTitle: 'مرحباً! أنا مرشد الذكاء الاصطناعي الخاص بك 👋',
      welcomeMessage: 'يمكنني مساعدتك في البرمجة، ونصائح المهنة، واستراتيجيات التعلم، والنمو الشخصي. ماذا تريد أن تستكشف اليوم؟',
      placeholder: 'اكتب رسالتك هنا...',
      send: 'إرسال',
      newChat: 'محادثة جديدة',
      suggestions: {
        programming: 'كيف يمكنني تحسين مهاراتي في البرمجة؟',
        project: 'اقترح مشروع تعلم جيد',
        resume: 'ساعدني في كتابة سيرة ذاتية قوية',
        career: 'نصائح مهنية للمطورين'
      },
      thinking: 'أفكر...',
      error: 'عذراً، واجهت خطأ. يرجى المحاولة مرة أخرى.',
      clearChat: 'مسح المحادثة'
    },
    de: {
      title: 'KI-Mentor',
      subtitle: 'Ihr intelligenter Lernbegleiter',
      welcomeTitle: 'Hallo! Ich bin Ihr KI-Mentor 👋',
      welcomeMessage: 'Ich kann Ihnen bei Programmierung, Karriereberatung, Lernstrategien und persönlichem Wachstum helfen. Was möchten Sie heute erkunden?',
      placeholder: 'Geben Sie hier Ihre Nachricht ein...',
      send: 'Senden',
      newChat: 'Neues Gespräch',
      suggestions: {
        programming: 'Wie kann ich meine Programmierfähigkeiten verbessern?',
        project: 'Schlagen Sie ein gutes Lernprojekt vor',
        resume: 'Helfen Sie mir, einen starken Lebenslauf zu schreiben',
        career: 'Karriereberatung für Entwickler'
      },
      thinking: 'Denke...',
      error: 'Entschuldigung, ich bin auf einen Fehler gestoßen. Bitte versuchen Sie es erneut.',
      clearChat: 'Chat löschen'
    }
  };

  const currentT = t[language] || t.en;

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation on mount
  useEffect(() => {
    loadConversation();
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('lang') || 'en');
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const loadConversation = async () => {
    try {
      // For now, we'll simulate loading a conversation
      // In a real implementation, this would fetch from your backend
      const savedMessages = localStorage.getItem('ai-mentor-messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const saveConversation = (newMessages) => {
    localStorage.setItem('ai-mentor-messages', JSON.stringify(newMessages));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    // Add user message
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      console.log('📤 Sending message to AI API:', input);
      
      // Simulate API call with realistic delay and response
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // Generate contextual response based on language and content
      const userLang = detectLanguage(input);
      const response = generateContextualResponse(input, userLang);
      
      console.log('📝 Generated response for language:', userLang);
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        language: userLang
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      saveConversation(finalMessages);

      // Update conversation ID
      if (!conversationId) {
        setConversationId(`conv_${Date.now()}`);
      }

    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      // Show user-friendly error message
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `${currentT.error}\n\nDetails: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };


  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    localStorage.removeItem('ai-mentor-messages');
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  // Language detection utility
  const detectLanguage = (text) => {
    // Persian detection
    const persianRegex = /[\u0600-\u06FF]/;
    if (persianRegex.test(text)) {
      return 'fa';
    }
    
    // Arabic detection
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    if (arabicRegex.test(text)) {
      return 'ar';
    }
    
    // Default to English
    return 'en';
  };

  // Contextual response generator
  const generateContextualResponse = (message, language) => {
    const inputLower = message.toLowerCase();
    
    const responses = {
      fa: {
        programming: "عالی! در اینجا راه‌های مؤثری برای بهبود مهارت‌های برنامه‌نویسی شما وجود دارد:\n\n1. **تمرین منظم** - هر روز کد بنویسید، حتی اگر فقط 30 دقیقه باشد\n2. **ساخت پروژه** - با پروژه‌های کوچک شروع کنید و به تدریج پیچیدگی را افزایش دهید\n3. **خواندن کد** - پروژه‌های open-source در GitHub را مطالعه کنید\n4. **یادگیری تکنولوژی‌های جدید** - با آخرین فریمورک‌ها و ابزارها به‌روز باشید\n5. **عضویت در جوامع** - در انجمن‌های برنامه‌نویسی و meetupها شرکت کنید\n6. **دریافت بازخورد** - کد خود را به اشتراک بگذارید و نظر بخواهید\n\nکدام زبان برنامه‌نویسی یا حوزه خاص شما را بیشتر جذب می‌کند؟",
        project: "در اینجا پروژه‌های عالی یادگیری برای سطوح مختلف مهارت وجود دارد:\n\n**مبتدی:**\n- اپلیکیشن لیست کارها\n- ماشین حساب\n- اپلیکیشن آب و هوا\n- وب‌سایت پورتفولیو شخصی\n\n**متوسط:**\n- وب‌سایت تجارت الکترونیک\n- پلتفرم وبلاگ\n- اپلیکیشن چت\n- سیستم مدیریت وظایف\n\n**پیشرفته:**\n- پلتفرم شبکه اجتماعی\n- ابزار همکاری real-time\n- مدل یادگیری ماشین\n- اپلیکیشن بلاک‌چین\n\nشما در کدام سطح هستید و چه نوع پروژه‌ای شما را جذب می‌کند؟",
        resume: "خوشحال می‌شوم به شما در ایجاد یک رزومه قوی کمک کنم! در اینجا چیزی که یک رزومه توسعه‌دهنده را برجسته می‌کند:\n\n**بخش‌های کلیدی:**\n- اطلاعات تماس واضح\n- خلاصه حرفه‌ای (2-3 خط)\n- مهارت‌های فنی (دسته‌بندی شده)\n- تجربه کاری (با دستاوردهای قابل اندازه‌گیری)\n- پروژه‌ها (با لینک‌های زنده و GitHub)\n- تحصیلات و گواهینامه‌ها\n\n**نکات:**\n- از افعال عمل استفاده کنید (توسعه داد، پیاده‌سازی کرد، بهینه‌سازی کرد)\n- معیارها را شامل کنید (عملکرد را 40% بهبود داد)\n- برای هر درخواست شغل سفارشی کنید\n- مختصر نگه دارید (1-2 صفحه)\n\nآیا می‌خواهید با بخش خاصی به شما کمک کنم؟",
        career: "مشاوره شغلی برای توسعه‌دهندگان - در اینجا استراتژی‌های کلیدی:\n\n**اوایل حرفه (0-2 سال):**\n- روی یادگیری اصول تمرکز کنید\n- پورتفولیو قوی بسازید\n- با سایر توسعه‌دهندگان شبکه‌سازی کنید\n- کارآموزی یا موقعیت‌های junior را در نظر بگیرید\n\n**میانه حرفه (3-7 سال):**\n- در یک حوزه تخصص پیدا کنید\n- فرصت‌های رهبری را بر عهده بگیرید\n- توسعه‌دهندگان junior را راهنمایی کنید\n- پروژه‌های جانبی یا فریلنسینگ را در نظر بگیرید\n\n**سطح ارشد (8+ سال):**\n- تصمیمات فنی را رهبری کنید\n- سیستم‌های پیچیده را معماری کنید\n- دانش را از طریق صحبت/نوشتن به اشتراک بگذارید\n- مدیریت یا مشاوره را در نظر بگیرید\n\nشما در کدام مرحله از سفر شغلی خود هستید؟",
        default: "این سوال جالبی است! خوشحال می‌شوم در این زمینه به شما کمک کنم. آیا می‌توانید جزئیات بیشتری در مورد آنچه که به طور خاص می‌خواهید بدانید ارائه دهید؟ من می‌توانم در برنامه‌نویسی، مشاوره شغلی، استراتژی‌های یادگیری و موضوعات توسعه شخصی کمک کنم."
      },
      en: {
        programming: "Great question! Here are some effective ways to improve your programming skills:\n\n1. **Practice regularly** - Code every day, even if it's just for 30 minutes\n2. **Build projects** - Start with small projects and gradually increase complexity\n3. **Read code** - Study open-source projects on GitHub\n4. **Learn new technologies** - Stay updated with latest frameworks and tools\n5. **Join communities** - Participate in coding forums and meetups\n6. **Get feedback** - Share your code and ask for reviews\n\nWhat specific programming language or area interests you most?",
        project: "Here are some excellent learning projects for different skill levels:\n\n**Beginner:**\n- Todo List App\n- Calculator\n- Weather App\n- Personal Portfolio Website\n\n**Intermediate:**\n- E-commerce Website\n- Blog Platform\n- Chat Application\n- Task Management System\n\n**Advanced:**\n- Social Media Platform\n- Real-time Collaboration Tool\n- Machine Learning Model\n- Blockchain Application\n\nWhich level are you at, and what type of project interests you?",
        resume: "I'd be happy to help you create a strong resume! Here's what makes a developer resume stand out:\n\n**Key Sections:**\n- Clear contact information\n- Professional summary (2-3 lines)\n- Technical skills (organized by category)\n- Work experience (with quantifiable achievements)\n- Projects (with live links and GitHub)\n- Education and certifications\n\n**Tips:**\n- Use action verbs (developed, implemented, optimized)\n- Include metrics (improved performance by 40%)\n- Tailor for each job application\n- Keep it concise (1-2 pages)\n\nWould you like me to help you with a specific section?",
        career: "Career advice for developers - here are key strategies:\n\n**Early Career (0-2 years):**\n- Focus on learning fundamentals\n- Build a strong portfolio\n- Network with other developers\n- Consider internships or junior positions\n\n**Mid Career (3-7 years):**\n- Specialize in a domain\n- Take on leadership opportunities\n- Mentor junior developers\n- Consider side projects or freelancing\n\n**Senior Level (8+ years):**\n- Lead technical decisions\n- Architect complex systems\n- Share knowledge through speaking/writing\n- Consider management or consulting\n\nWhat stage are you at in your career journey?",
        default: "That's an interesting question! I'd be happy to help you with that. Could you provide a bit more detail about what specifically you'd like to know? I can assist with programming, career advice, learning strategies, and personal development topics."
      }
    };

    const langResponses = responses[language] || responses.en;
    
    if (inputLower.includes('programming') || inputLower.includes('برنامه‌نویسی') || inputLower.includes('کد')) {
      return langResponses.programming;
    } else if (inputLower.includes('project') || inputLower.includes('پروژه')) {
      return langResponses.project;
    } else if (inputLower.includes('resume') || inputLower.includes('رزومه') || inputLower.includes('cv')) {
      return langResponses.resume;
    } else if (inputLower.includes('career') || inputLower.includes('شغل') || inputLower.includes('حرفه')) {
      return langResponses.career;
    } else {
      return langResponses.default;
    }
  };

  return (
    <div className="ai-mentor-container">
      <div className="ai-mentor-header">
        <div className="header-content">
          <div className="header-icon">
            <Bot className="w-8 h-8" />
      </div>
          <div className="header-text">
            <h1>{currentT.title}</h1>
            <p>{currentT.subtitle}</p>
          </div>
        </div>
        <button onClick={startNewConversation} className="new-chat-btn">
          <Plus className="w-4 h-4" />
          {currentT.newChat}
        </button>
             </div>
             
      <div className="chat-container">
        <div className="messages-list">
                 <AnimatePresence>
            {messages.length === 0 ? (
                    <motion.div 
                initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                className="welcome-message"
              >
                <div className="welcome-icon">
                  <MessageSquare className="w-16 h-16" />
                </div>
                <h2>{currentT.welcomeTitle}</h2>
                <p>{currentT.welcomeMessage}</p>
                <div className="suggestion-chips">
                  <button 
                    onClick={() => handleSuggestionClick(currentT.suggestions.programming)}
                    className="suggestion-chip"
                  >
                    {currentT.suggestions.programming}
                  </button>
                  <button 
                    onClick={() => handleSuggestionClick(currentT.suggestions.project)}
                    className="suggestion-chip"
                  >
                    {currentT.suggestions.project}
                  </button>
                  <button 
                    onClick={() => handleSuggestionClick(currentT.suggestions.resume)}
                    className="suggestion-chip"
                  >
                    {currentT.suggestions.resume}
                  </button>
                  <button 
                    onClick={() => handleSuggestionClick(currentT.suggestions.career)}
                    className="suggestion-chip"
                  >
                    {currentT.suggestions.career}
                  </button>
                      </div>
                    </motion.div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`message ${msg.role} ${msg.isError ? 'error' : ''}`}
                >
                  <div className="message-avatar">
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className="message-content">
                    <div className="message-text">
                      {msg.content}
                    </div>
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
             </div>
           </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="message assistant"
            >
              <div className="message-avatar">
                <Bot className="w-5 h-5" />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="thinking-text">{currentT.thinking}</div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="message-input-form">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentT.placeholder}
              disabled={loading}
              className="message-input"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="send-button"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIMentor;
