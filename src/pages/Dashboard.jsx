
import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield } from "lucide-react";
import ProofCard from "../components/dashboard/ProofCard";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SetPriceButton from "../components/dashboard/SetPriceButton";
import { Plus, BarChart2 } from 'lucide-react';
import DashboardStats from '../components/dashboard/DashboardStats';

const translations = {
  en: {
    title: 'My Proofs',
    newProof: 'New Proof',
    noProofsYet: 'No proofs yet',
    noProofsDesc: 'Functionality to create and view proofs is temporarily disabled.',
    createFirstProof: 'Create a Proof',
    viewOnIPFS: 'View on IPFS',
    ipfs: 'IPFS',
    viewDetails: 'View Details',
    details: 'Details',
    connectWalletPrompt: 'Functionality to view proofs is temporarily disabled.',
    connectWallet: 'Connect Wallet'
  },
  fa: {
    title: 'گواهی‌های من',
    newProof: 'گواهی جدید',
    noProofsYet: 'هنوز گواهی‌ای ندارید',
    noProofsDesc: 'قابلیت ایجاد و مشاهده گواهی‌ها موقتاً غیرفعال است.',
    createFirstProof: 'ایجاد اولین گواهی',
    viewOnIPFS: 'مشاهده در IPFS',
    ipfs: 'IPFS',
    viewDetails: 'مشاهده جزئیات',
    details: 'جزئیات',
    connectWalletPrompt: 'قابلیت مشاهده گواهی‌ها موقتاً غیرفعال است.',
    connectWallet: 'اتصال کیف پول'
  },
  zh: {
    title: '我的证明',
    newProof: '新证明',
    noProofsYet: '暂无证明',
    noProofsDesc: '创建您的第一个证明，以保护您的想法。',
    createFirstProof: '创建您的第一个证明',
    viewOnIPFS: '在IPFS上查看',
    ipfs: 'IPFS',
    viewDetails: '查看详情',
    details: '详情',
    connectWalletPrompt: '请连接您的钱包以查看您的证明。',
    connectWallet: '连接钱包'
  },
  hi: {
    title: 'मेरे प्रमाण',
    newProof: 'नया प्रमाण',
    noProofsYet: 'अभी तक कोई प्रमाण नहीं',
    noProofsDesc: 'अपने विचारों को सुरक्षित करने के लिए अपना पहला प्रमाण बनाएं।',
    createFirstProof: 'अपना पहला प्रमाण बनाएं',
    viewOnIPFS: 'IPFS पर देखें',
    ipfs: 'IPFS',
    viewDetails: 'विवरण देखें',
    details: 'विवरण',
    connectWalletPrompt: 'अपने प्रमाण देखने के लिए कृपया अपना वॉलेट कनेक्ट करें।',
    connectWallet: 'वॉलेट कनेक्ट करें'
  },
  ur: {
    title: 'میرے ثبوت',
    newProof: 'نیا ثبوت',
    noProofsYet: 'ابھی تک کوئی ثبوت نہیں',
    noProofsDesc: 'اپنے نظریات کو محفوظ بنانے کے لیے اپنا پہلا ثبوت بنائیں۔',
    createFirstProof: 'اپنا پہلا ثبوت بنائیں',
    viewOnIPFS: 'IPFS پر دیکھیں',
    ipfs: 'IPFS',
    viewDetails: 'تفصیلات دیکھیں',
    details: 'تفصیلات',
    connectWalletPrompt: 'اپنے ثبوت دیکھنے کے لیے براہ کرم اپنا والٹ منسلک کریں۔',
    connectWallet: 'والٹ منسلک کریں'
  },
  de: {
    title: 'Meine Nachweise',
    newProof: 'Neuer Nachweis',
    noProofsYet: 'Noch keine Nachweise',
    noProofsDesc: 'Erstellen Sie Ihren ersten Nachweis, um Ihre Ideen zu sichern.',
    createFirstProof: 'Ersten Nachweis erstellen',
    viewOnIPFS: 'Auf IPFS ansehen',
    ipfs: 'IPFS',
    viewDetails: 'Details anzeigen',
    details: 'Details',
    connectWalletPrompt: 'Bitte verbinden Sie Ihre Wallet, um Ihre Nachweise anzuzeigen.',
    connectWallet: 'Wallet verbinden'
  },
  fr: {
    title: 'Mes Preuves',
    newProof: 'Nouvelle Preuve',
    noProofsYet: 'Aucune preuve pour le moment',
    noProofsDesc: 'Créez votre première preuve pour sécuriser vos idées.',
    createFirstProof: 'Créer votre première preuve',
    viewOnIPFS: 'Voir sur IPFS',
    ipfs: 'IPFS',
    viewDetails: 'Voir les détails',
    details: 'Détails',
    connectWalletPrompt: 'Veuillez connecter votre portefeuille pour voir vos preuves.',
    connectWallet: 'Connecter le portefeuille'
  },
  es: {
    title: 'Mis Pruebas',
    newProof: 'Nueva Prueba',
    noProofsYet: 'Aún no hay pruebas',
    noProofsDesc: 'Crea tu primera prueba para asegurar tus ideas.',
    createFirstProof: 'Crea tu primera prueba',
    viewOnIPFS: 'Ver en IPFS',
    ipfs: 'IPFS',
    viewDetails: 'Ver Detalles',
    details: 'Detalles',
    connectWalletPrompt: 'Por favor, conecta tu billetera para ver tus pruebas.',
    connectWallet: 'Conectar Billetera'
  },
  ar: {
    title: 'إثباتاتي',
    newProof: 'إثبات جديد',
    noProofsYet: 'لا توجد إثباتات بعد',
    noProofsDesc: 'أنشئ أول إثبات لك لتأمين أفكارك.',
    createFirstProof: 'أنشئ إثباتك الأول',
    viewOnIPFS: 'عرض على IPFS',
    ipfs: 'IPFS',
    viewDetails: 'عرض التفاصيل',
    details: 'تفاصيل',
    connectWalletPrompt: 'يرجى ربط محفظتك لعرض إثباتاتك.',
    connectWallet: 'ربط المحفظة'
  },
  ru: {
    title: 'Мои доказательства',
    newProof: 'Новое доказательство',
    noProofsYet: 'Пока нет доказательств',
    noProofsDesc: 'Создайте свое первое доказательство, чтобы защитить свои идеи.',
    createFirstProof: 'Создать первое доказательство',
    viewOnIPFS: 'Посмотреть в IPFS',
    ipfs: 'IPFS',
    viewDetails: 'Посмотреть детали',
    details: 'Детали',
    connectWalletPrompt: 'Пожалуйста, подключите свой кошелек, чтобы просмотреть свои доказательства.',
    connectWallet: 'Подключить кошелек'
  },
  ja: {
    title: '私の証明',
    newProof: '新しい証明',
    noProofsYet: '証明はまだありません',
    noProofsDesc: 'あなたのアイデアを保護するために、最初の証明を作成してください。',
    createFirstProof: '最初の証明を作成',
    viewOnIPFS: 'IPFSで表示',
    ipfs: 'IPFS',
    viewDetails: '詳細を表示',
    details: '詳細',
    connectWalletPrompt: '証明を表示するにはウォレットを接続してください。',
    connectWallet: 'ウォレットを接続'
  },
  ko: {
    title: '나의 증명',
    newProof: '새로운 증명',
    noProofsYet: '아직 증명이 없습니다',
    noProofsDesc: '아이디어를 안전하게 보관하려면 첫 번째 증명을 만드세요.',
    createFirstProof: '첫 증명 만들기',
    viewOnIPFS: 'IPFS에서 보기',
    ipfs: 'IPFS',
    viewDetails: '세부 정보 보기',
    details: '세부 정보',
    connectWalletPrompt: '증명을 보려면 지갑을 연결하세요.',
    connectWallet: '지갑 연결'
  },
  sw: {
    title: 'Uthibitisho Wangu',
    newProof: 'Uthibitisho Mpya',
    noProofsYet: 'Hakuna uthibitisho bado',
    noProofsDesc: 'Tengeneza uthibitisho wako wa kwanza ili kulinda mawazo yako.',
    createFirstProof: 'Tengeneza Uthibitisho wako wa Kwanza',
    viewOnIPFS: 'Tazama kwenye IPFS',
    ipfs: 'IPFS',
    viewDetails: 'Tazama Maelezo',
    details: 'Maelezo',
    connectWalletPrompt: 'Tafadhali unganisha mkoba wako ili kuona uthibitisho wako.',
    connectWallet: 'Unganisha Mkoba'
  },
  ha: {
    title: 'Tabbaci na',
    newProof: 'Sabon Tabbaci',
    noProofsYet: 'Babu tabbaci tukuna',
    noProofsDesc: 'Ƙirƙiri tabbacinka na farko don kare ra\'ayoyinka.',
    createFirstProof: 'Ƙirƙiri Tabbacinka na Farko',
    viewOnIPFS: 'Duba a kan IPFS',
    ipfs: 'IPFS',
    viewDetails: 'Duba Cikakken Bayani',
    details: 'Cikakken Bayani',
    connectWalletPrompt: 'Da fatan za a haɗa walat ɗinku don duba tabbacinku.',
    connectWallet: 'Haɗa Walat'
  },
  yo: {
    title: 'Àwọn Ẹ̀rí Mi',
    newProof: 'Ẹ̀rí Tuntun',
    noProofsYet: 'Ko si ẹri sibẹsibẹ',
    noProofsDesc: 'Ṣẹda ẹri akọkọ rẹ lati daabobo awọn imọran rẹ.',
    createFirstProof: 'Ṣẹda Ẹri Akọkọ Rẹ',
    viewOnIPFS: 'Wo lori IPFS',
    ipfs: 'IPFS',
    viewDetails: 'Wo Awọn Alaye',
    details: 'Alaye',
    connectWalletPrompt: 'Jọwọ sopọ si apamọwọ rẹ lati wo awọn ẹri rẹ.',
    connectWallet: 'Sopọ Apamọwọ'
  },
  tr: {
    title: 'Kanıtlarım',
    newProof: 'Yeni Kanıt',
    noProofsYet: 'Henüz kanıt yok',
    noProofsDesc: 'Fikirlerinizi güvence altına almak için ilk kanıtınızı oluşturun.',
    createFirstProof: 'İlk Kanıtınızı Oluşturun',
    viewOnIPFS: 'IPFS\'de Görüntüle',
    ipfs: 'IPFS',
    viewDetails: 'Detayları Görüntüle',
    details: 'Detaylar',
    connectWalletPrompt: 'Kanıtlarınızı görüntülemek için lütfen cüzdanınızı bağlayın.',
    connectWallet: 'Cüzdanı Bağla'
  },
  bal: {
    title: 'منی گواهی',
    newProof: 'نوکیں گواهی',
    noProofsYet: 'هچ گواهی انگت نیست',
    noProofsDesc: 'گواهی جوڑ کنگ و دیست کنگ ءِ توان موقتاً غیرفعال اِنت.',
    createFirstProof: 'وتی اولی گواهی ءَ جوڑ کن',
    viewOnIPFS: 'IPFS ءِ سر ءَ بچار',
    ipfs: 'IPFS',
    viewDetails: 'جزئیات ءَ بچار',
    details: 'جزئیات',
    connectWalletPrompt: 'گواهیانی دیستن ءِ توان موقتاً غیرفعال اِنت.',
    connectWallet: 'والٹ ءَ بندگ'
  }
};

export default function Dashboard() {
  const [proofs, setProofs] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Set to false initially
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
  const [filters, setFilters] = useState({ query: '', category: 'all', sortBy: 'newest' });

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('lang') || 'en');
    };
    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  // loadProofs, handleProofUpdate, and filteredProofs are removed
  // as they are no longer relevant without wallet connection or proof data.

  const t = translations[language] || translations.en;

  // The entire page is effectively disabled without a wallet.
  // We will show the "No proofs yet" message with a disabled note.
  return (
    <div className="p-3 md:p-6" dir={['fa', 'ar', 'ur', 'bal'].includes(language) ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4"
        >
          <div className="flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-[#00E5FF]" />
            <h1 className="text-3xl font-bold text-white">{t.title}</h1>
          </div>
          <Button disabled className="glow-button text-white font-semibold w-full md:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              {t.newProof}
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="text-center">
            <p className="text-white">Loading your proofs...</p>
          </div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <DashboardStats proofs={proofs} /> {/* proofs will be an empty array */}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <DashboardFilters filters={filters} onFilterChange={setFilters} />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <div className="col-span-full text-center py-20">
                  <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-2">{t.noProofsYet}</h3>
                  <p className="text-gray-400 mb-6">{t.noProofsDesc}</p>
                  <Button disabled className="glow-button px-8 py-3 rounded-xl text-white font-semibold">
                      {t.createFirstProof}
                  </Button>
                </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
