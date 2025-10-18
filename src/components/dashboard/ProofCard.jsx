
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { FileText, Tag, Calendar, Eye, CheckCircle, Clock } from 'lucide-react';
import VisibilityToggle from "./VisibilityToggle";
import SetPriceButton from "./SetPriceButton";
import ValidationStatusBadge from '../proof/ValidationStatusBadge';
// Removed: import { useAppWallet } from '../hooks/useAppWallet';

const translations = {
  en: {
    category: 'Category',
    created: 'Created',
    notPublic: 'Not Public',
    public: 'Public',
    owner: 'You are the owner'
  },
  fa: {
    category: 'دسته‌بندی',
    created: 'ایجاد شده در',
    notPublic: 'خصوصی',
    public: 'عمومی',
    owner: 'شما مالک هستید'
  },
  zh: {
    category: '类别',
    created: '创建于',
    notPublic: '不公开',
    public: '公开',
    owner: '您是所有者'
  },
  hi: {
    category: 'श्रेणी',
    created: 'बनाया गया',
    notPublic: 'सार्वजनिक नहीं',
    public: 'सार्वजनिक',
    owner: 'आप मालिक हैं'
  },
  ur: {
    category: 'زمرہ',
    created: 'تخلیق کیا گیا',
    notPublic: 'عوامی نہیں',
    public: 'عوامی',
    owner: 'آپ مالک ہیں'
  },
  de: {
    category: 'Kategorie',
    created: 'Erstellt am',
    notPublic: 'Nicht öffentlich',
    public: 'Öffentlich',
    owner: 'Sie sind der Besitzer'
  },
  fr: {
    category: 'Catégorie',
    created: 'Créé le',
    notPublic: 'Non public',
    public: 'Public',
    owner: 'Vous êtes le propriétaire'
  },
  es: {
    category: 'Categoría',
    created: 'Creado el',
    notPublic: 'No público',
    public: 'Público',
    owner: 'Tú eres el dueño'
  },
  ar: {
    category: 'فئة',
    created: 'تم إنشاؤه في',
    notPublic: 'غير عام',
    public: 'عام',
    owner: 'أنت المالك'
  },
  ru: {
    category: 'Категория',
    created: 'Создано',
    notPublic: 'Не общедоступно',
    public: 'Общедоступно',
    owner: 'Вы владелец'
  },
  ja: {
    category: 'カテゴリー',
    created: '作成日',
    notPublic: '非公開',
    public: '公開',
    owner: 'あなたが所有者です'
  },
  ko: {
    category: '카테고리',
    created: '생성일',
    notPublic: '비공개',
    public: '공개',
    owner: '소유자입니다'
  },
  sw: {
    category: 'Kategoria',
    created: 'Imeundwa',
    notPublic: 'Sio ya Umma',
    public: 'Umma',
    owner: 'Wewe ndiye mmiliki'
  },
  ha: {
    category: 'Rukuni',
    created: 'An ƙirƙira',
    notPublic: 'Ba na Jama\'a ba',
    public: 'Jama\'a',
    owner: 'Kai ne mamallaki'
  },
  yo: {
    category: 'Ẹka',
    created: 'Ti a ṣẹda',
    notPublic: 'Kii ṣe ti Gbogbo eniyan',
    public: 'Gbogbo eniyan',
    owner: 'Iwọ ni oniwun'
  },
  tr: {
    category: 'Kategori',
    created: 'Oluşturuldu',
    notPublic: 'Herkese Açık Değil',
    public: 'Herkese Açık',
    owner: 'Sahibi sizsiniz'
  },
  bal: {
    category: 'دسته‌بندی',
    created: 'جوڑ کنگ بوتگ',
    notPublic: 'عوامی نہ اِنت',
    public: 'عوامی',
    owner: 'تئو واجہ ئے'
  }
};


export default function ProofCard({ proof, onUpdate }) {
  const [language, setLanguage] = React.useState(localStorage.getItem('lang') || 'en');
  // Removed wallet hooks
  
  React.useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('lang') || 'en');
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  // Since wallet is removed, we cannot determine ownership. isOwner is always false.
  const isOwner = false;
  
  const t = translations[language] || translations.en;
  
  const formattedDate = proof.created_date ? new Date(proof.created_date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glow-card rounded-2xl overflow-hidden shadow-lg h-full flex flex-col"
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <Link to={createPageUrl(`PublicProof?id=${proof.id}`)}>
            <h3 className="text-lg font-bold text-white hover:text-blue-400 transition-colors duration-200 line-clamp-2">{proof.title}</h3>
          </Link>
          <ValidationStatusBadge status={proof.validation_status} />
        </div>

        <p className="text-sm text-gray-400 mb-4 line-clamp-3 h-[60px]">{proof.description || 'No description provided.'}</p>

        <div className="space-y-3 text-sm">
          <div className="flex items-center text-gray-400">
            <Tag className="w-4 h-4 mr-2 text-cyan-400" />
            <span>{t.category || 'Category'}: <span className="font-semibold text-gray-300 capitalize">{proof.category}</span></span>
          </div>
          <div className="flex items-center text-gray-400">
            <Calendar className="w-4 h-4 mr-2 text-purple-400" />
            <span>{t.created || 'Created'}: <span className="font-semibold text-gray-300">{formattedDate}</span></span>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="bg-gray-800/30 p-3 flex justify-end items-center gap-4 border-t border-white/10">
          <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded">{t.owner}</span>
          <VisibilityToggle proof={proof} onUpdate={onUpdate} />
        </div>
      )}
    </motion.div>
  );
}
