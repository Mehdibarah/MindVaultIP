import React, { useState, useEffect } from 'react';
import { User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const translations = {
  en: {
    title: 'User Profile',
    connectPrompt: 'Profile functionality is temporarily disabled.',
  },
  fa: {
    title: 'پروفایل کاربری',
    connectPrompt: 'قابلیت مشاهده پروفایل موقتاً غیرفعال است.',
  },
  zh: {
    title: '用户个人资料',
    connectPrompt: '个人资料功能暂时禁用。',
  },
  hi: {
    title: 'उपयोगकर्ता प्रोफ़ाइल',
    connectPrompt: 'प्रोफ़ाइल কার্যকারিতা अस्थायी रूप से अक्षम है।',
  },
  ur: {
    title: 'صارف پروفائل',
    connectPrompt: 'پروفائل کی فعالیت عارضی طور پر غیر فعال ہے۔',
  },
  de: {
    title: 'Benutzerprofil',
    connectPrompt: 'Die Profilfunktionalität ist vorübergehend deaktiviert.',
  },
  fr: {
    title: 'Profil de l\'utilisateur',
    connectPrompt: 'La fonctionnalité de profil est temporairement désactivée.',
  },
  es: {
    title: 'Perfil de Usuario',
    connectPrompt: 'La funcionalidad del perfil está temporalmente deshabilitada.',
  },
  ar: {
    title: 'ملف المستخدم',
    connectPrompt: 'تم تعطيل وظيفة الملف الشخصي مؤقتًا.',
  },
  ru: {
    title: 'Профиль пользователя',
    connectPrompt: 'Функциональность профиля временно отключена.',
  },
  ja: {
    title: 'ユーザープロフィール',
    connectPrompt: 'プロフィール機能は一時的に無効になっています。',
  },
  ko: {
    title: '사용자 프로필',
    connectPrompt: '프로필 기능이 일시적으로 비활성화되었습니다.',
  },
  sw: {
    title: 'Wasifu wa Mtumiaji',
    connectPrompt: 'Utendaji wa wasifu umezimwa kwa muda.',
  },
  ha: {
    title: 'Bayanin Mai Amfani',
    connectPrompt: 'An dakatar da aikin bayanan martaba na ɗan lokaci.',
  },
  yo: {
    title: 'Profaili Olumulo',
    connectPrompt: 'Iṣẹ-ṣiṣe profaili ti wa ni alaabo fun igba diẹ.',
  },
  tr: {
    title: 'Kullanıcı Profili',
    connectPrompt: 'Profil işlevi geçici olarak devre dışı bırakıldı.',
  },
  bal: {
    title: 'کاربر ءِ پروفائل',
    connectPrompt: 'پروفائل ءِ کار موقتاً غیرفعال اِنت.',
  }
};

export default function Profile() {
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    const handleLanguageChange = () => setLanguage(localStorage.getItem('lang') || 'en');
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = translations[language] || translations.en;

  // The page is disabled because wallet functionality was removed.
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20 px-4" dir={['fa', 'ar', 'ur', 'bal'].includes(language) ? 'rtl' : 'ltr'}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <UserIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">{t.connectPrompt}</h3>
        </motion.div>
    </div>
  );
}