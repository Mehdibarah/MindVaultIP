import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquare } from 'lucide-react';

const translations = {
  en: {
    title: 'Messages',
    featureDisabled: 'Messaging Disabled',
    featureDisabledDesc: 'This feature is currently unavailable as wallet functionality has been removed.',
  },
  fa: {
    title: 'پیام‌ها',
    featureDisabled: 'پیام‌رسانی غیرفعال است',
    featureDisabledDesc: 'این قابلیت در حال حاضر به دلیل حذف شدن عملکرد کیف پول، در دسترس نیست.',
  },
  zh: {
    title: '消息',
    featureDisabled: '消息功能已禁用',
    featureDisabledDesc: '由于钱包功能已被移除，此功能当前不可用。',
  },
  hi: {
    title: 'संदेश',
    featureDisabled: 'मैसेजिंग अक्षम है',
    featureDisabledDesc: 'वॉलेट कार्यक्षमता हटा दिए जाने के कारण यह सुविधा वर्तमान में अनुपलब्ध है।',
  },
  ur: {
    title: 'پیغامات',
    featureDisabled: 'پیغام رسانی غیر فعال ہے',
    featureDisabledDesc: 'یہ فیچر فی الحال دستیاب نہیں ہے کیونکہ والیٹ کی فعالیت کو ہٹا دیا گیا ہے۔',
  },
  de: {
    title: 'Nachrichten',
    featureDisabled: 'Nachrichten deaktiviert',
    featureDisabledDesc: 'Diese Funktion ist derzeit nicht verfügbar, da die Wallet-Funktionalität entfernt wurde.',
  },
  fr: {
    title: 'Messages',
    featureDisabled: 'Messagerie désactivée',
    featureDisabledDesc: 'Cette fonctionnalité est actuellement indisponible car la fonctionnalité de portefeuille a été supprimée.',
  },
  es: {
    title: 'Mensajes',
    featureDisabled: 'Mensajería desactivada',
    featureDisabledDesc: 'Esta función no está disponible actualmente porque se ha eliminado la funcionalidad de la billetera.',
  },
  ar: {
    title: 'رسائلي',
    featureDisabled: 'الرسائل معطلة',
    featureDisabledDesc: 'هذه الميزة غير متاحة حاليًا حيث تم إزالة وظائف المحفظة.',
  },
  ru: {
    title: 'Сообщения',
    featureDisabled: 'Обмен сообщениями отключен',
    featureDisabledDesc: 'Эта функция в настоящее время недоступна, так как функциональность кошелька была удалена.',
  },
  ja: {
    title: 'メッセージ',
    featureDisabled: 'メッセージ機能は無効です',
    featureDisabledDesc: 'ウォレット機能が削除されたため、この機能は現在利用できません。',
  },
  ko: {
    title: '메시지',
    featureDisabled: '메시지 기능 비활성화됨',
    featureDisabledDesc: '지갑 기능이 제거되어 현재 이 기능을 사용할 수 없습니다.',
  },
   sw: {
    title: 'Ujumbe',
    featureDisabled: 'Ujumbe Umezimwa',
    featureDisabledDesc: 'Kipengele hiki hakipatikani kwa sasa kwa kuwa utendakazi wa pochi umeondolewa.',
  },
  ha: {
    title: 'Saƙonni',
    featureDisabled: 'An kashe Saƙonni',
    featureDisabledDesc: 'Wannan fasalin a halin yanzu babu shi saboda an cire aikin walat.',
  },
  yo: {
    title: 'Àwọn ìránṣẹ́',
    featureDisabled: 'Fifiranṣẹ Ti wa ni alaabo',
    featureDisabledDesc: 'Ẹya yii ko si lọwọlọwọ nitori iṣẹ apamọwọ ti yọkuro.',
  },
  tr: {
    title: 'Mesajlarım',
    featureDisabled: 'Mesajlaşma Devre Dışı',
    featureDisabledDesc: 'Cüzdan işlevselliği kaldırıldığı için bu özellik şu anda kullanılamıyor.',
  },
  bal: {
    title: 'پیام',
    featureDisabled: 'پیام رسانی غیرفعال اِنت',
    featureDisabledDesc: 'اے فیچر انگت دسترسی نہ اِنت چیا کہ والیٹ ءِ کارکردگی دور کنگ بوتگ.',
  }
};

export default function Messages() {
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

  const t = translations[language] || translations['en'];
  const isRTL = ['fa', 'ar', 'ur', 'bal'].includes(language);

  return (
    <div className="h-screen flex items-center justify-center bg-[#0B1220] text-white p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center">
        <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t.featureDisabled}</h2>
        <p className="text-gray-400">{t.featureDisabledDesc}</p>
      </div>
    </div>
  );
}