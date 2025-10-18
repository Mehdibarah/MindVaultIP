
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, Send, Loader2, BrainCircuit, Paperclip, Mic, X, ArrowUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { InvokeLLM, UploadFile } from '@/api/integrations';
import { motion, AnimatePresence } from 'framer-motion';
import ChatSidebar from '../components/ai-mentor/ChatSidebar';

const translations = {
  en: {
    typing: "AI is typing",
    title: "AI Mentor",
    subtitle: "Your personal guide for navigating the world of intellectual property. Ask me anything!",
    initialGreeting: "Hello! I am your AI Mentor. I can help you with questions about patents, trademarks, commercialization, and more. How can I assist you today?",
    inputPlaceholder: "Ask a question about your idea...",
    suggestions: "Or try one of these suggestions:",
    speechError: "Speech recognition not supported or permission denied.",
    uploadError: "Sorry, I couldn't upload the file. Please try again.",
    aiError: "Sorry, I encountered an error. Please try again.",
    selectChat: "Select a conversation or start a new one.",
    newChat: "New Chat",
    noChats: "No conversations yet.",
    example1: 'How do I know if my idea is patentable?',
    example2: 'What are the steps to commercialize a product?',
    example3: 'Explain the difference between a trademark and a copyright.',
    error: 'Sorry, I encountered an error. Please try again.',
    pageTitle: 'AI Mentor',
    welcome: "Welcome to your AI Mentor",
    welcomeDesc: "Get answers about intellectual property, market strategy, and more. Start by asking a question.",
    noHistory: "No conversation history",
    noHistoryDesc: "Start a new conversation to see it here.",
    thinking: "Thinking...",
    sendMessage: "Send"
  },
  fa: {
    typing: "هوش مصنوعی در حال نوشتن است",
    title: "مربی هوشمند",
    subtitle: "راهنمای شخصی شما برای دنیای مالکیت معنوی. هر سوالی دارید بپرسید!",
    initialGreeting: "سلام! من مربی هوشمند شما هستم. می‌توانم در مورد ثبت اختراع، علائم تجاری، تجاری‌سازی و موارد دیگر به شما کمک کنم. امروز چگونه می‌توانم به شما کمک کنم؟",
    inputPlaceholder: "در مورد ایده خود سوالی بپرسید...",
    suggestions: "یا یکی از این پیشنهادها را امتحان کنید:",
    speechError: "تشخیص گفتار پشتیبانی نمی‌شود یا دسترسی رد شده است.",
    uploadError: "متاسفم، نتوانستم فایل را بارگذاری کنم. لطفاً دوباره تلاش کنید.",
    aiError: "متاسفم، با خطا مواجه شدم. لطفاً دوباره تلاش کنید.",
    selectChat: "یک گفتگو را انتخاب کنید یا یک گفتگوی جدید شروع کنید.",
    newChat: "گفتگوی جدید",
    noChats: "هنوز گفتگویی ندارید.",
    example1: 'چگونه بفهمم ایده‌ام قابل ثبت است؟',
    example2: 'مراحل تجاری‌سازی یک محصول چیست؟',
    example3: 'تفاوت بین علامت تجاری و حق چاپ را توضیح دهید.',
    error: 'متاسفم، با خطا مواجه شدم. لطفاً دوباره تلاش کنید.',
    pageTitle: "مرشد الذكاء الاصطناعي", // This seems like an Arabic translation, but it's in fa. Keeping for now.
    welcome: "مرحبًا بك في مرشد الذكاء الاصطناعي الخاص بك", // This seems like an Arabic translation, but it's in fa. Keeping for now.
    welcomeDesc: "احصل على إجابات حول الملكية الفكرية، واستراتيجية السوق، والمزيد. ابدأ بطرح سؤال.", // This seems like an Arabic translation, but it's in fa. Keeping for now.
    noHistory: "لا يوجد سجل محادثات", // This seems like an Arabic translation, but it's in fa. Keeping for now.
    noHistoryDesc: "ابدأ محادثة جديدة لرؤيتها هنا.", // This seems like an Arabic translation, but it's in fa. Keeping for now.
    thinking: "يفكر...", // This seems like an Arabic translation, but it's in fa. Keeping for now.
    sendMessage: "إرسال" // This seems like an Arabic translation, but it's in fa. Keeping for now.
  },
  zh: {
    typing: "AI正在输入",
    title: "AI导师",
    subtitle: "您在知识产权世界中的个人向导。问我任何问题！",
    initialGreeting: "您好！我是您的AI导师。我可以帮助您解决有关专利、商标、商业化等问题。今天我能为您做些什么？",
    inputPlaceholder: "问一个关于您想法的问题...",
    suggestions: "或者尝试以下建议:",
    speechError: "语音识别不受支持或权限被拒绝。",
    uploadError: "抱歉，我无法上传文件。请再试一次。",
    aiError: "抱歉，我遇到了一个错误。请再试一次。",
    selectChat: "选择一个对话或开始一个新的对话。",
    newChat: "新对话",
    noChats: "暂无对话。",
    example1: '我如何知道我的想法是否可以申请专利？',
    example2: '将产品商业化的步骤是什么？',
    example3: '解释商标和版权之间的区别。',
    error: '抱歉，我遇到了一个错误。请再试一次。'
  },
  hi: {
    typing: "एआई टाइप कर रहा है",
    title: "एआई मेंटर",
    subtitle: "बौद्धिक संपदा की दुनिया में नेविगेट करने के लिए आपका व्यक्तिगत मार्गदर्शक। मुझसे कुछ भी पूछें!",
    initialGreeting: "नमस्ते! मैं आपका एआई मेंटर हूं। मैं पेटेंट, ट्रेडमार्क, व्यावसायीकरण, और बहुत कुछ के बारे में आपके सवालों में मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
    inputPlaceholder: "अपने विचार के बारे में एक प्रश्न पूछें...",
    suggestions: "या इन सुझावों में से एक को आजमाएं:",
    speechError: "वाक् पहचान समर्थित नहीं है या अनुमति अस्वीकृत है।",
    uploadError: "क्षमा करें, मैं फ़ाइल अपलोड नहीं कर सका। कृपया पुनः प्रयास करें।",
    aiError: "क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।",
    selectChat: "एक बातचीत का चयन करें या एक नई शुरुआत करें।",
    newChat: "नई बातचीत",
    noChats: "अभी तक कोई बातचीत नहीं।",
    example1: 'मुझे कैसे पता चलेगा कि मेरा विचार पेटेंट योग्य है?',
    example2: 'किसी उत्पाद का व्यावसायीकरण करने के क्या कदम हैं?',
    example3: 'ट्रेडमार्क और कॉपीराइट के बीच अंतर स्पष्ट करें।',
    error: 'क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।'
  },
  ur: {
    typing: "اے آئی ٹائپ کر رہا ہے",
    title: "AI مینٹور",
    subtitle: "دانشورانہ املاک کی دنیا میں تشریف لانے کے لیے آپ کا ذاتی رہنما۔ مجھ سے کچھ بھی پوچھیں!",
    initialGreeting: "خوش آمدید! میں آپ کا AI مینٹور ہوں۔ میں پیٹنٹ، ٹریڈ مارک، کمرشلائزیشن، اور مزید کے بارے میں آپ کے سوالات میں مدد کر سکتا ہوں۔ آج میں آپ کی کس طرح مدد کر سکتا ہوں؟",
    inputPlaceholder: "اپنے نظریے کے بارے میں ایک سوال پوچھیں...",
    suggestions: "یا ان تجاویز میں سے ایک کو آزمائیں:",
    speechError: "صوتی شناخت تعاون یافتہ نہیں ہے یا اجازت مسترد کر دی گئی ہے۔",
    uploadError: "معذرت، میں فائل اپ لوڈ نہیں کر سکا۔ براہ کرم دوبارہ کوشش کریں۔",
    aiError: "معذرت، مجھے ایک خرابی کا سامنا کرنا پڑا۔ براہ کرم دوبارہ کوشش کریں۔",
    selectChat: "ایک گفتگو منتخب کریں یا ایک نئی شروع کریں۔",
    newChat: "نئی گفتگو",
    noChats: "ابھی تک کوئی گفتگو نہیں۔",
    example1: 'مجھے کیسے پتہ چلے گا کہ میرا نظریہ پیٹنٹ کے قابل ہے؟',
    example2: 'کسی مصنوعات کو کمرشلائز کرنے کے کیا اقدامات ہیں؟',
    example3: 'ٹریڈ مارک اور کاپی رائٹ کے درمیان فرق واضح کریں۔',
    error: 'معذرت، مجھے ایک خرابی کا سامنا کرنا پڑا۔ براہ کرم دوبارہ کوشش کریں۔'
  },
  de: {
    typing: "KI tippt",
    title: "KI-Mentor",
    subtitle: "Ihr persönlicher Führer durch die Welt des geistigen Eigentums. Fragen Sie mich alles!",
    initialGreeting: "Hallo! Ich bin Ihr KI-Mentor. Ich kann Ihnen bei Fragen zu Patenten, Marken, Kommerzialisierung und mehr helfen. Wie kann ich Ihnen heute helfen?",
    inputPlaceholder: "Fragen Sie etwas über Patente, Marken oder Ihre Ideen...",
    suggestions: "Oder probieren Sie einen dieser Vorschläge aus:",
    speechError: "Spracherkennung nicht unterstützt oder Berechtigung verweigert.",
    uploadError: "Entschuldigung, ich konnte die Datei nicht hochladen. Bitte versuchen Sie es erneut.",
    aiError: "Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    selectChat: "Wählen Sie eine Unterhaltung oder starten Sie eine neue.",
    newChat: "Neuer Chat",
    noChats: "Noch keine Gespräche.",
    example1: 'Woher weiß ich, ob meine Idee patentierbar ist?',
    example2: 'Was sind die Schritte zur Kommerzialisierung eines Produkts?',
    example3: 'Erklären Sie den Unterschied zwischen einer Marke und einem Urheberrecht.',
    error: 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    pageTitle: 'KI-Mentor',
    welcome: "Willkommen bei Ihrem KI-Mentor",
    welcomeDesc: "Erhalten Sie Antworten zu geistigem Eigentum, Marktstrategie und mehr. Beginnen Sie mit einer Frage.",
    noHistory: "Kein Gesprächsverlauf",
    noHistoryDesc: "Starten Sie eine neue Unterhaltung, um sie hier zu sehen.",
    thinking: "Denke nach...",
    sendMessage: "Senden",
    welcomeMessage: 'Willkommen bei Ihrem KI-Mentor. Ich bin hier, um Ihnen bei der Navigation durch die Welt des geistigen Eigentums zu helfen. Wie kann ich Ihnen heute helfen?',
    generating: 'Generiere...',
    history: 'Verlauf',
    clearConversations: 'Konversationen löschen',
    confirmClear: 'Sind Sie sicher?',
    emptyHistory: 'Noch kein Chat-Verlauf'
  },
  fr: {
    typing: "L'IA est en train d'écrire",
    title: "Mentor IA",
    subtitle: "Votre guide personnel pour naviguer dans le monde de la propriété intellectuelle. Demandez-moi n'importe quoi !",
    initialGreeting: "Bonjour ! Je suis votre mentor IA. Je peux vous aider avec des questions sur les brevets, les marques, la commercialisation, et plus. Comment puis-je vous aider aujourd'hui ?",
    inputPlaceholder: "Posez une question sur votre idée...",
    suggestions: "Ou essayez l'une de ces suggestions :",
    speechError: "Reconnaissance vocale non prise en charge ou autorisation refusée.",
    uploadError: "Désolé, je n'ai pas pu télécharger le fichier. Veuillez réessayer.",
    aiError: "Désolé, j'ai rencontré une erreur. Veuillez réessayer.",
    selectChat: "Sélectionnez une conversation ou démarrez-en une nouvelle.",
    newChat: "Nouvelle conversation",
    noChats: "Aucune conversation pour le moment.",
    example1: 'Comment savoir si mon idée est brevetable ?',
    example2: 'Quelles sont les étapes pour commercialiser un produit ?',
    example3: 'Expliquez la différence entre une marque et un droit d\'auteur.',
    error: 'Désolé, j\'ai rencontré une erreur. Veuillez réessayer.'
  },
  es: {
    typing: "La IA está escribiendo",
    title: "Mentor de IA",
    subtitle: "Tu guía personal para navegar por el mundo de la propiedad intelectual. ¡Pregúntame cualquier cosa!",
    initialGreeting: "¡Hola! Soy tu Mentor de IA. Puedo ayudarte con preguntas sobre patentes, marcas registradas, comercialización y más. ¿Cómo puedo ayudarte hoy?",
    inputPlaceholder: "Haz una pregunta sobre tu idea...",
    suggestions: "O prueba una de estas sugerencias:",
    speechError: "Reconocimiento de voz no compatible o permiso denegado.",
    uploadError: "Lo siento, no pude subir el archivo. Por favor, inténtalo de nuevo.",
    aiError: "Lo siento, he encontrado un error. Por favor, inténtalo de nuevo.",
    selectChat: "Selecciona una conversación o inicia una nueva.",
    newChat: "Nuevo chat",
    noChats: "Aún no hay conversaciones.",
    example1: '¿Cómo sé si mi idea es patentable?',
    example2: '¿Cuáles son los pasos para comercializar un producto?',
    example3: 'Explica la diferencia entre una marca registrada y un derecho de autor.',
    error: 'Lo siento, he encontrado un error. Por favor, inténtalo de nuevo.'
  },
  ar: {
    typing: "الذكاء الاصطناعي يكتب",
    title: "المرشد الذكي",
    subtitle: "دليلك الشخصي لاستكشاف عالم الملكية الفكرية. اسألني أي شيء!",
    initialGreeting: "مرحبًا! أنا مرشدك الذكي. يمكنني مساعدتك في الإجابة على أسئلة حول براءات الاختراع والعلامات التجارية والتسويق التجاري والمزيد. كيف يمكنني مساعدتك اليوم؟",
    inputPlaceholder: "اطرح سؤالاً حول فكرتك...",
    suggestions: "أو جرب أحد هذه الاقتراحات:",
    speechError: "التعرف على الكلام غير مدعوم أو تم رفض الإذن.",
    uploadError: "عذرًا، لم أتمكن من تحميل الملف. يرجى المحاولة مرة أخرى.",
    aiError: "عذرًا، واجهت خطأ. يرجى المحاولة مرة أخرى.",
    selectChat: "اختر محادثة أو ابدأ محادثة جديدة.",
    newChat: "محادثة جديدة",
    noChats: "لا توجد محادثات بعد.",
    example1: 'كيف أعرف ما إذا كانت فكرتي قابلة للحصول على براءة اختراع؟',
    example2: 'ما هي خطوات تسويق منتج تجاريًا؟',
    example3: 'اشرح الفرق بين العلامة التجارية وحقوق النشر.',
    error: 'عذرًا، واجهت خطأ. يرجى المحاولة مرة أخرى.',
    pageTitle: "مرشد الذكاء الاصطناعي",
    welcome: "مرحبًا بك في مرشد الذكاء الاصطناعي الخاص بك",
    welcomeDesc: "احصل على إجابات حول الملكية الفكرية، واستراتيجية السوق، والمزيد. ابدأ بطرح سؤال.",
    noHistory: "لا يوجد سجل محادثات",
    noHistoryDesc: "ابدأ محادثة جديدة لرؤيتها هنا.",
    thinking: "يفكر...",
    sendMessage: "إرسال"
  },
  ru: {
    typing: "ИИ печатает",
    title: "ИИ-наставник",
    subtitle: "Ваш личный гид по миру интеллектуальной собственности. Спросите меня о чем угодно!",
    initialGreeting: "Здравствуйте! Я ваш ИИ-наставник. Я могу помочь вам с вопросами о патентах, товарных знаках, коммерциализации и многом другом. Чем я могу помочь вам сегодня?",
    inputPlaceholder: "Задайте вопрос о вашей идее...",
    suggestions: "Или попробуйте одно из этих предложений:",
    speechError: "Распознавание речи не поддерживается или разрешение отклонено.",
    uploadError: "Извините, мне не удалось загрузить файл. Пожалуйста, попробуйте еще раз.",
    aiError: "Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.",
    selectChat: "Выберите беседу или начните новую.",
    newChat: "Новый чат",
    noChats: "Пока нет бесед.",
    example1: 'Как мне узнать, патентоспособна ли моя идея?',
    example2: 'Каковы шаги по коммерциализации продукта?',
    example3: 'Объясните разницу между товарным знаком и авторским правом.',
    error: 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.'
  },
  ja: {
    typing: "AIが入力中",
    title: "AIメンター",
    subtitle: "知的財産の世界をナビゲートするためのあなたのパーソナルガイド。何でも聞いてください！",
    initialGreeting: "こんにちは！私はあなたのAIメンターです。特許、商標、商業化などに関する質問でお手伝いできます。今日はどのようにお手伝いしましょうか？",
    inputPlaceholder: "あなたのアイデアについて質問してください...",
    suggestions: "または、以下の提案を試してください:",
    speechError: "音声認識はサポートされていません、または許可が拒否されました。",
    uploadError: "申し訳ありません、ファイルをアップロードできませんでした。もう一度お試しください。",
    aiError: "申し訳ありません、エラーが発生しました。もう一度お試しください。",
    selectChat: "会話を選択するか、新しい会話を開始してください。",
    newChat: "新しいチャット",
    noChats: "まだ会話はありません。",
    example1: '自分のアイデアが特許取得可能かどうかを知るにはどうすればよいですか？',
    example2: '製品を商業化するための手順は何ですか？',
    example3: '商標と著作権の違いを説明してください。',
    error: '申し訳ありません、エラーが発生しました。もう一度お試しください。'
  },
  ko: {
    typing: "AI가 입력 중입니다",
    title: "AI 멘토",
    subtitle: "지적 재산의 세계를 탐색하는 당신의 개인 가이드. 무엇이든 물어보세요!",
    initialGreeting: "안녕하세요! 저는 당신의 AI 멘토입니다. 특허, 상표, 상용화 등에 대한 질문에 도움을 드릴 수 있습니다. 오늘은 어떻게 도와드릴까요?",
    inputPlaceholder: "아이디어에 대해 질문해보세요...",
    suggestions: "또는 다음 제안 중 하나를 시도해보세요:",
    speechError: "음성 인식이 지원되지 않거나 권한이 거부되었습니다.",
    uploadError: "죄송합니다, 파일을 업로드할 수 없었습니다. 다시 시도해주세요.",
    aiError: "죄송합니다, 오류가 발생했습니다. 다시 시도해주세요.",
    selectChat: "대화를 선택하거나 새 대화를 시작하세요.",
    newChat: "새 채팅",
    noChats: "아직 대화가 없습니다.",
    example1: '내 아이디어가 특허 가능한지 어떻게 알 수 있나요?',
    example2: '제품을 상용화하는 단계는 무엇인가요?',
    example3: '상표와 저작권의 차이점을 설명해주세요.',
    error: '죄송합니다, 오류가 발생했습니다. 다시 시도해주세요.'
  },
  sw: {
    typing: "AI inaandika",
    title: "Mshauri wa AI",
    subtitle: "Mwongozo wako binafsi wa kuvinjari ulimwengu wa mali miliki. Niulize chochote!",
    initialGreeting: "Habari! Mimi ni Mshauri wako wa AI. Ninaweza kukusaidia na maswali kuhusu hataza, alama za biashara, biashara, na zaidi. Ninawezaje kukusaidia leo?",
    inputPlaceholder: "Uliza swali kuhusu wazo lako...",
    suggestions: "Au jaribu mojawapo ya mapendekezo haya:",
    speechError: "Utambuzi wa hotuba hautumiki au ruhusa imekataliwa.",
    uploadError: "Samahani, nimeshindwa kupakia faili. Tafadhali jaribu tena.",
    aiError: "Samahani, nimepata hitilafu. Tafadhali jaribu tena.",
    selectChat: "Chagua mazungumzo au anza jipya.",
    newChat: "Gumzo Mpya",
    noChats: "Hakuna mazungumzo bado.",
    example1: 'Nitajuaje kama wazo langu linaweza kupata hataza?',
    example2: 'Ni hatua zipi za kufanya biashara ya bidhaa?',
    example3: 'Eleza tofauti kati ya alama ya biashara na hakimiliki.',
    error: 'Samahani, nimepata hitilafu. Tafadhali jaribu tena.'
  },
  ha: {
    typing: "AI yana rubutu",
    title: "Mai ba da shawara na AI",
    subtitle: "Jagoranka na kanka don kewaya duniyar kadarorin hankali. Tambaye ni komai!",
    initialGreeting: "Sannu! Ni ne Mai ba da shawara na AI. Zan iya taimaka maka da tambayoyi game da haƙƙin mallaka, alamun kasuwanci, kasuwanci, da ƙari. Ta yaya zan iya taimaka maka a yau?",
    inputPlaceholder: "Yi tambaya game da ra'ayin ku...",
    suggestions: "Ko gwada ɗaya daga cikin waɗannan shawarwari:",
    speechError: "Ba a tallafa wa gane murya ba ko an hana izini.",
    uploadError: "Yi haƙuri, na kasa loda fayil ɗin. Da fatan za a sake gwadawa.",
    aiError: "Yi haƙuri, na haɗu da kuskure. Da fatan za a sake gwadawa.",
    selectChat: "Zaɓi tattaunawa ko fara sabo.",
    newChat: "Sabon Tattaunawa",
    noChats: "Babu tattaunawa tukuna.",
    example1: 'Ta yaya zan san idan ra\'ayina ya cancanci haƙƙin mallaka?',
    example2: 'Menene matakan kasuwancin samfur?',
    example3: 'Yi bayanin bambanci tsakanin alamar kasuwanci da haƙƙin mallaka.',
    error: 'Yi haƙuri, na haɗu da kuskure. Da fatan za a sake gwadawa.'
  },
  yo: {
    typing: "AI n tẹwe",
    title: "Oluranlọwọ AI",
    subtitle: "Itọsọna ti ara ẹni fun lilọ kiri ni agbaye ti ohun-ini ọgbọn. Beere ohunkohun lọwọ mi!",
    initialGreeting: "Pẹlẹ o! Emi ni Oluranlọwọ AI rẹ. Mo le ṣe iranlọwọ fun ọ pẹlu awọn ibeere nipa awọn iwe-aṣẹ, awọn aami-iṣowo, iṣowo, ati diẹ sii. Bawo ni MO ṣe le ṣe iranlọwọ fun ọ loni?",
    inputPlaceholder: "Beere ibeere kan nipa ero rẹ...",
    suggestions: "Tabi gbiyanju ọkan ninu awọn imọran wọnyi:",
    speechError: "Atunse ọrọ ko ni atilẹyin tabi a ti kọ igbanilaaye.",
    uploadError: "Ma binu, Emi ko le gbe faili naa si. Jọwọ gbiyanju lẹẹkansi.",
    aiError: "Ma binu, Mo pade aṣiṣe kan. Jọwọ gbiyanju lẹẹkansi.",
    selectChat: "Yan ibaraẹnisọrọ kan tabi bẹrẹ tuntun kan.",
    newChat: "Ibaraẹnisọrọ Titun",
    noChats: "Ko si awọn ibaraẹnisọrọ sibẹsibẹ.",
    example1: 'Bawo ni MO ṣe mọ boya ero mi jẹ itọsi?',
    example2: 'Kini awọn igbesẹ lati ṣe iṣowo ọja kan?',
    example3: 'Ṣe alaye iyatọ laarin aami-iṣowo ati aṣẹ-lori.',
    error: 'Ma binu, Mo pade aṣiṣe kan. Jọwọ gbiyanrilẹkansi.',
    pageTitle: "Olùkọ́ AI",
    sendMessage: "Firanṣẹ"
  },
  tr: {
    typing: "Yapay zeka yazıyor",
    title: "Yapay Zeka Mentorü",
    subtitle: "Fikri mülkiyet dünyasında gezinmek için kişisel rehberiniz. Bana her şeyi sorun!",
    initialGreeting: "Merhaba! Ben sizin Yapay Zeka Mentorünüzüm. Patentler, ticari markalar, ticarileştirme ve daha fazlası hakkındaki sorularınızda size yardımcı olabilirim. Bugün size nasıl yardımcı olabilirim?",
    inputPlaceholder: "Fikriniz hakkında bir soru sorun...",
    suggestions: "Veya şu önerilerden birini deneyin:",
    speechError: "Konuşma tanıma desteklenmiyor veya izin reddedildi.",
    uploadError: "Üzgünüm, dosyayı yükleyemedim. Lütfen tekrar deneyin.",
    aiError: "Üzgünüm, bir hatayla karşılaştım. Lütfen tekrar deneyin.",
    selectChat: "Bir sohbet seçin veya yeni bir sohbet başlatın.",
    newChat: "Yeni Sohbet",
    noChats: "Henüz sohbet yok.",
    example1: 'Fikrimin patentlenebilir olup olmadığını nasıl anlarım?',
    example2: 'Bir ürünü ticarileştirmenin adımları nelerdir?',
    example3: 'Ticari marka ile telif hakkı arasındaki farkı açıklayın.',
    error: 'Üzgünüm, bir hatayla karşılaştım. Lütfen tekrar deneyin.'
  },
  ku: {
    typing: "AI dinivîse",
    title: "Şêwirmendê AI",
    subtitle: "Rêberê we yê kesane ji bo gerîna li cîhana milkê entelektuelî. Her tiştî ji min bipirsin!",
    initialGreeting: "Silav! Ez Şêwirmendê we yê AI me. Ez dikarim ji we re di derbarê patentan, marqeyên bazirganî, bazirganîkirin û bêtir pirsan de alîkariyê bikim. Ez dikarim îro çawa alîkariya we bikim?",
    inputPlaceholder: "Li ser fikra xwe pirsek bipirsin...",
    suggestions: "An jî yek ji van pêşniyaran biceribînin:",
    speechError: "Nasîna axaftinê nayê piştgirî kirin an destûr hate red kirin.",
    uploadError: "Bibore, min nekarî pelê barkim. Ji kerema xwe dîsa biceribîne.",
    aiError: "Bibore, ez bi xeletiyekê re rû bi rû mam. Ji kerema xwe dîsa biceribîne.",
    selectChat: "Axaftinek hilbijêrin an ya nû dest pê bikin.",
    newChat: "Chat Nû",
    noChats: "Hêj sohbet tune.",
    example1: 'Ez çawa dizanim ku fikra min patentable e?',
    example2: 'Gavên bazirganîkirina hilberek çi ne?',
    example3: 'Cûdahiya di navbera marqeyek bazirganî û mafê kopîkirinê de rave bikin.',
    error: 'Bibore, ez bi xeletiyekê re rû bi rû mam. Ji kerema xwe dîsa biceribîne.'
  },
  ps: {
    typing: "AI لیکل کوي",
    title: "AI ښوونکی",
    subtitle: "د فکري ملکیت نړۍ کې د تګ لپاره ستاسو شخصي لارښود. له ما څخه هرڅه وپوښتئ!",
    initialGreeting: "سلام! زه ستاسو AI ښوونکی یم. زه کولی شم تاسو سره د پیټنټونو، سوداګریزو نښو، سوداګریز کولو، او نورو په اړه پوښتنو کې مرسته وکړم. زه نن څنګه کولی شم له تاسو سره مرسته وکړم؟",
    inputPlaceholder: "د خپلې نظریې په اړه یوه پوښتنه وکړئ...",
    suggestions: "یا له دې وړاندیزونو څخه یو هڅه وکړئ:",
    speechError: "د وینا پیژندنه نه ده ملاتړ شوې یا اجازه رد شوې ده.",
    uploadError: "بخښنه غواړم، ما نشو کولی فایل اپلوډ کړم. مهرباني وکړئ بیا هڅه وکړئ.",
    aiError: "بخښنه غواړم، ما یوه تېروتنه وموندله. مهرباني وکړئ بیا هڅه وکړئ.",
    selectChat: "یوې خبرو اترو ته وټاکئ یا نوې پیل کړئ.",
    newChat: "نوې خبرې اترې",
    noChats: "تر اوسه کومې خبرې اترې نشته.",
    example1: 'زه څنګه پوهیږم چې زما نظریه د پیټنټ وړ ده؟',
    example2: 'د یو محصول د سوداګریز کولو مرحلې کومې دي؟',
    example3: 'د سوداګریزې نښې او کاپي حق ترمنځ توپیر تشریح کړئ.',
    error: 'بخښنه غواړم، ما یوه تېروتنه وموندله. مهرباني وکړئ بیا هڅه وکړئ.'
  },
  bal: {
    typing: "AI نويسينگ اِنت",
    title: "AI راهنما",
    subtitle: "شما ءِ ذاتی راهشون اِنت ته интеллектуаلی ملکیت ءِ جهان ءَ پد ءَ بگندات. هر چیز ءِ باروا جست کن!",
    initialGreeting: "سلام! من شما ءِ AI راهنما آں. من شما ءَ پٹنٹ، ٹریڈ مارک، کمرشلائزیشن، ءُ دگہ بازیں چیزانی باروا سوالات ءَ کمک کُت کناں. مرچی من چون شما ءِ کمک ءَ کُت کناں؟",
    inputPlaceholder: "پٹنٹ، ٹریڈ مارک، یا وتی آئیڈیاز ءِ باروا ءَ چیزے جست کن...",
    suggestions: "یا اے پیشنهاداں چہ یکے ءَ امتحان کن:",
    speechError: "گالانی شناخت پشتیبانی نہ بیت یا اجازت رد کنگ بوتگ.",
    uploadError: "ببش، من نتوانستگ فایل ءَ اپلوڈ بکناں. مهربانی کُت ءَ دگہ رندے امتحان کن.",
    aiError: "ببش، من یک خطا ءَ روبرو بوتگ آں. مهربانی کُت ءَ دگہ رندے امتحان کن.",
    selectChat: "یک گپ ءُ تران ءِ انتخاب کن یا نوکیں یکے ءَ بندات کن.",
    newChat: "نوکیں گپ ءُ تران",
    noChats: "انگت ہچ گپ ءُ تران نیست.",
    example1: 'من چون بزاں کہ من ءِ آئیڈیا پٹنٹ کنگ ءَ اِنت؟',
    example2: 'یک جنس ءِ کمرشلائزیشن ءِ گامگیج چے اَنت؟',
    example3: 'ٹریڈ مارک ءُ کاپی رائٹ ءِ نیام ءَ فرق ءَ شرح کن.',
    error: 'ببش، من یک خطا ءَ روبرو بوتگ آں. مهربانی کُت ءَ دگہ رندے امتحان کن.',
    pageTitle: 'AI راهنما',
    welcome: "وتی AI راهنما ءَ وش آتک کن ئے",
    welcomeDesc: "انٹلیکچوئل پراپرٹی، بازار ءِ حکمت عملی ءُ دگہ بازیں چیزانی باروا ءَ پسو گش. یک سوالے ءَ بندات کن.",
    noHistory: "گپ ءُ تران ءِ ہچ تاریخ نیست",
    noHistoryDesc: "نوکیں گپ ءُ تران ءِ بندات کن تاکہ ادا ءَ بگندات.",
    thinking: "لوٹینگ ءَ اِنت...",
    sendMessage: "روان کن",
    welcomeMessage: 'وتی AI راهنما ءَ وش آتک کن ئے. من اداں تاکہ интеллектуаلی ملکیت ءِ دنیا ءِ تہ ءَ تئی راهنمائی ءَ بکناں. مرچی چون تئی کمک ءَ کُت کناں؟',
    generating: 'جوڑ کنگ ءَ اِنت...',
    history: 'تاریخ',
    clearConversations: 'گپ ءُ تراناں ءَ پاک کن',
    confirmClear: 'تئو مطمئن ئے؟',
    emptyHistory: 'انگت هچ گپ ءُ تران ءِ تاریخ نیست'
  }
};

const AITypingIndicator = ({ t }) => (
  <div className="flex items-center gap-2 text-gray-400 text-sm">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span>{t.typing}...</span>
  </div>
);

export default function AIMentorPage() {
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  const t = translations[language] || translations.en;

  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('aiMentorSessions');
      const lastActiveId = localStorage.getItem('aiMentorLastActiveId');
      if (savedSessions) {
        setChatSessions(JSON.parse(savedSessions));
        // Only restore lastActiveId if it refers to an existing session
        if (lastActiveId && JSON.parse(savedSessions).some(s => s.id === lastActiveId)) {
            setActiveSessionId(lastActiveId);
        } else {
            setActiveSessionId(null); // No valid last active session
        }
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
      localStorage.removeItem('aiMentorSessions');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aiMentorSessions', JSON.stringify(chatSessions));
    // Only save activeSessionId if it's an actual session ID, not 'new' or null
    if (activeSessionId && activeSessionId !== 'new') {
      localStorage.setItem('aiMentorLastActiveId', activeSessionId);
    } else if (activeSessionId === null) {
      localStorage.removeItem('aiMentorLastActiveId');
    }
  }, [chatSessions, activeSessionId]);
  
  useEffect(() => {
    const handleLanguageChange = () => setLanguage(localStorage.getItem('lang') || 'en');
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatSessions, activeSessionId, isLoading]);
  
  useEffect(() => {
      // Speech recognition setup can go here if needed
  }, [language]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  const activeMessages = chatSessions.find(s => s.id === activeSessionId)?.messages || [];

  const handleSendMessage = async (prompt = userInput) => {
    if (!prompt.trim() && !uploadedFile) return;

    const userMessage = {
      role: 'user',
      content: prompt.trim(),
      file: uploadedFile ? { name: uploadedFile.name, url: uploadedFile.url } : null,
    };
    
    setIsLoading(true);
    setUploadedFile(null);
    setUserInput('');

    let currentSessionId = activeSessionId;
    let newSessions = [...chatSessions];

    // If activeSessionId is 'new' or null, create a new session
    if (currentSessionId === 'new' || !currentSessionId) {
      currentSessionId = crypto.randomUUID();
      const newSession = {
        id: currentSessionId,
        title: prompt.trim().substring(0, 40) || t.newChat, // Use newChat translation for title
        messages: [userMessage],
      };
      newSessions = [newSession, ...newSessions];
      setActiveSessionId(currentSessionId);
    } else {
      const sessionIndex = newSessions.findIndex(s => s.id === currentSessionId);
      if (sessionIndex !== -1) {
        const updatedSession = {
          ...newSessions[sessionIndex],
          messages: [...newSessions[sessionIndex].messages, userMessage],
        };
        // Move updated session to the top
        newSessions.splice(sessionIndex, 1);
        newSessions.unshift(updatedSession);
      }
    }
    setChatSessions(newSessions);

    try {
      const file_urls = uploadedFile ? [uploadedFile.url] : null;
      const aiResponse = await InvokeLLM({ prompt: prompt.trim(), file_urls: file_urls });
      const aiMessageContent = typeof aiResponse === 'object' ? JSON.stringify(aiResponse) : aiResponse;

      const aiMessage = { role: 'ai', content: aiMessageContent };
      
      const finalSessions = newSessions.map(s => 
        s.id === currentSessionId
          ? { ...s, messages: [...s.messages, aiMessage] }
          : s
      );
      setChatSessions(finalSessions);

    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = { role: 'ai', content: t.aiError };
      const finalSessions = newSessions.map(s => 
        s.id === currentSessionId
          ? { ...s, messages: [...s.messages, errorMessage] }
          : s
      );
      setChatSessions(finalSessions);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewChat = () => {
    setActiveSessionId('new'); // Use a special ID for new chat
    setUserInput('');
    setUploadedFile(null);
  };
  
  const handleDeleteChat = (sessionId) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId || activeSessionId === 'new') { // If current active chat is deleted or we are in 'new' state, go to null
      setActiveSessionId(null);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setUploadedFile({ name: file.name, url: file_url, type: file.type });
    } catch (error) {
      console.error(error);
      alert(t.uploadError);
    } finally {
      setIsUploading(false);
    }
  };
  
  const welcomeScreenVisible = activeSessionId === null;
  const chatScreenVisible = activeSessionId !== null;

  return (
    <div className="flex bg-[#0B1220] h-full text-white" dir={language === 'fa' || language === 'ar' || language === 'ur' || language === 'ps' || language === 'ku' || language === 'bal' ? 'rtl' : 'ltr'}>
      {/* Sidebar: Hidden on mobile when a chat is active ('new' or existing) */}
      <div className={`w-full md:w-1/4 lg:w-1/5 border-r border-gray-700 ${chatScreenVisible ? 'hidden' : 'flex'} md:flex flex-col`}>
        <ChatSidebar 
          sessions={chatSessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectChat={setActiveSessionId}
          onDeleteChat={handleDeleteChat}
          newChatText={t.newChat}
          noChatsText={t.noChats}
        />
      </div>
      
      {/* Main Window */}
      <div className={`flex-1 flex flex-col ${welcomeScreenVisible ? 'hidden' : 'flex'} md:flex`}>
        {welcomeScreenVisible && (
          // Welcome screen content, hidden on mobile to show sidebar instead
          <div className="flex-1 hidden md:flex flex-col items-center justify-center text-center p-8">
            <BrainCircuit className="w-20 h-20 text-blue-500/50 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">{t.title}</h2>
            <p className="text-gray-400">{t.selectChat}</p>
          </div>
        )}

        {chatScreenVisible && (
           <div className="flex-1 flex flex-col overflow-y-hidden">
             {/* Chat Header with Back Button */}
             <div className="p-4 border-b border-gray-800 flex items-center gap-3 flex-shrink-0">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveSessionId(null)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-lg font-semibold text-white truncate">
                    {activeSessionId === 'new' ? t.newChat : (chatSessions.find(s => s.id === activeSessionId)?.title || t.title)}
                </h2>
             </div>
             
             {/* Messages Area */}
             <div className="flex-1 p-6 overflow-y-auto">
                 <AnimatePresence>
                  {activeMessages.map((msg, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start gap-4 mb-6 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-blue-400"/></div>}
                      <div className={`max-w-xl p-4 rounded-xl ${msg.role === 'user' ? 'bg-blue-600' : 'bg-[#1a2332]'}`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5"/></div>}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && <AITypingIndicator t={t} />}
                <div ref={messagesEndRef} />
             </div>
           </div>
        )}
        
        {/* Input Form - show only if a chat is active ('new' or existing) */}
        {chatScreenVisible && (
          <div className="p-4 border-t border-gray-800 flex-shrink-0">
              <div className="relative bg-[#1a2332] rounded-xl p-2 flex items-center gap-2">
                   <Textarea
                      ref={textareaRef}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      placeholder={t.inputPlaceholder}
                      className="bg-transparent border-none text-white placeholder:text-gray-400 focus:ring-0 resize-none w-full"
                      rows={1}
                  />
                  <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={() => document.getElementById('file-upload').click()}>
                      <Paperclip className="w-5 h-5 text-gray-400" />
                  </Button>
                  <input type="file" id="file-upload" className="hidden" onChange={handleFileSelect} />

                   <Button type="submit" size="icon" className="glow-button rounded-full w-10 h-10" onClick={() => handleSendMessage()} disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
                  </Button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
