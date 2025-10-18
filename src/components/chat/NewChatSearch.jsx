
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

const translations = {
  en: {
    placeholder: 'Enter wallet address to start chat...',
    startChat: 'Start Chat'
  },
  fa: {
    placeholder: 'آدرس کیف پول را وارد کنید...',
    startChat: 'شروع چت'
  },
  ar: {
    placeholder: 'أدخل عنوان المحفظة لبدء الدردشة...',
    startChat: 'بدء الدردشة'
  },
  zh: {
    placeholder: '输入钱包地址以开始聊天...',
    startChat: '开始聊天'
  },
  hi: {
    placeholder: 'चैट शुरू करने के लिए वॉलेट पता दर्ज करें...',
    startChat: 'चैट शुरू करें'
  },
  ur: {
    placeholder: 'چیٹ شروع کرنے کے لیے والیٹ کا پتہ درج کریں...',
    startChat: 'چیٹ شروع کریں'
  },
  de: {
    placeholder: 'Wallet-Adresse eingeben, um den Chat zu starten...',
    startChat: 'Chat starten'
  },
  fr: {
    placeholder: 'Entrez l\'adresse du portefeuille pour démarrer le chat...',
    startChat: 'Démarrer le chat'
  },
  es: {
    placeholder: 'Ingrese la dirección de la billetera para iniciar el chat...',
    startChat: 'Iniciar chat'
  },
  ru: {
    placeholder: 'Введите адрес кошелька, чтобы начать чат...',
    startChat: 'Начать чат'
  },
  ja: {
    placeholder: 'チャットを開始するにはウォレットアドレスを入力してください...',
    startChat: 'チャットを開始'
  },
  ko: {
    placeholder: '채팅을 시작하려면 지갑 주소를 입력하세요...',
    startChat: '채팅 시작'
  },
  sw: {
    placeholder: 'Weka anwani ya pochi ili kuanza soga...',
    startChat: 'Anza Soga'
  },
  ha: {
    placeholder: 'Shigar da adireshin walat don fara hira...',
    startChat: 'Fara Hira'
  },
  yo: {
    placeholder: 'Tẹ adirẹsi apamọwọ lati bẹrẹ iwiregbe...',
    startChat: 'Bẹrẹ iwiregbe'
  },
  tr: {
    placeholder: 'Sohbeti başlatmak için cüzdan adresini girin...',
    startChat: 'Sohbeti Başlat'
  },
  ku: {
    placeholder: 'Navnîşana berîka xwe binivîse da ku dest bi sohbetê bike...',
    startChat: 'Dest bi Sohbetê Bike'
  },
  ps: {
    placeholder: 'د خبرو اترو پیلولو لپاره د والټ پته دننه کړئ...',
    startChat: 'خبرې اترې پیل کړئ'
  }
};

export default function NewChatSearch({ onSearch }) {
  const [searchAddress, setSearchAddress] = useState('');
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('lang') || 'en');
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      onSearch(searchAddress.trim());
      setSearchAddress('');
    }
  };

  const t = translations[language] || translations.en;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          placeholder={t.placeholder}
          className="pl-9 bg-[#1a2332] border-gray-600 text-white placeholder:text-gray-400"
          dir={language === 'fa' || language === 'ar' || language === 'ur' || language === 'ps' || language === 'ku' ? 'rtl' : 'ltr'}
        />
      </div>
      <Button 
        type="submit" 
        size="sm" 
        disabled={!searchAddress.trim()}
        className="bg-[#2F80FF] hover:bg-[#1F70EF] px-3"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </form>
  );
}
