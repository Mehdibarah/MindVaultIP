
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import NotificationBell from "@/components/notifications/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import UnifiedWalletConnect from "@/components/wallet/UnifiedWalletConnect";
import { safeApiCall } from "@/utils/apiErrorHandler";
import { safeBase44Auth } from "@/utils/base44ErrorHandler";
import { FEATURE_AI_MENTOR, FEATURE_MESSAGES, FEATURE_MARKETPLACE, FEATURE_EXPERT_DASHBOARD, FEATURE_ADMIN_PANEL } from "@/utils/featureFlags";
import { getCurrentLocale, setLocale, getLanguageName, SUPPORTED_LOCALES } from "@/utils/i18nConfig";

// Updated Lucide React imports
import { Home, LayoutDashboard, User, Bot, ShoppingCart, MessageSquare, List, Compass, BookOpen, Shield, Banknote, UserCog, MoreHorizontal, Languages, Coins, PlusCircle, Menu, X } from "lucide-react";


const translations = {
  en: {
    dashboard: "Dashboard",
    expertDashboard: "Expert Panel",
    gallery: "Gallery",
    messages: "Messages",
    aiMentor: "AI Mentor",
    marketplace: "Marketplace",
    watchlist: "Watchlist",
    profile: "Profile",
    more: "More",
    tokenFactory: "Token Factory",
    whitePaper: "White Paper",
    walletSecurity: "Wallet Security",
    adminPanel: "Admin Panel",
    platform: "Platform",
    createProof: "Create Proof",
    learn: "Learn",
    legal: "Legal",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    footerText: "The world's first decentralized platform for intellectual property, powered by AI.",
    footerRights: "© {year} MindVaultIP. Built on Base Network.",
    footerLine: "Built on Base Network | Powered by AI Council™ | © {year} MindVaultIP Ltd."
  },
  fa: {
    dashboard: 'داشبورد',
    expertDashboard: 'پنل متخصصین',
    gallery: 'گالری',
    messages: 'پیام‌ها',
    aiMentor: 'مربی هوش مصنوعی',
    marketplace: 'بازار',
    watchlist: 'لیست من',
    profile: 'پروفایل',
    more: 'بیشتر',
    tokenFactory: 'کارخانه توکن',
    whitePaper: 'وایت پیپر',
    walletSecurity: 'امنیت کیف پول',
    adminPanel: 'پنل مدیریت',
    platform: 'پلتفرم',
    createProof: 'ثبت گواهی',
    learn: 'آموزش',
    legal: 'حقوقی',
    termsOfService: "شرایط خدمات",
    privacyPolicy: "سیاست حفظ حریم خصوصی",
    footerText: "اولین پلتفرم غیرمتمرکز مالکیت معنوی در جهان، با قدرت هوش مصنوعی.",
    footerRights: "© {year} MindVaultIP. ساخته شده بر روی شبکه Base.",
    footerLine: "ساخته شده بر روی شبکه Base | قدرت گرفته از شورای هوش مصنوعی™ | © {year} MindVaultIP Ltd."
  },
  zh: {
    dashboard: "仪表板",
    expertDashboard: "专家面板",
    gallery: "画廊",
    messages: "消息",
    aiMentor: "AI导师",
    marketplace: "市场",
    watchlist: "关注列表",
    profile: "个人资料",
    more: "更多",
    tokenFactory: "代币工厂",
    whitePaper: "白皮书",
    walletSecurity: "钱包安全",
    adminPanel: "管理面板",
    platform: "平台",
    createProof: "创建证明",
    learn: "学习",
    legal: "法律",
    termsOfService: "服务条款",
    privacyPolicy: "隐私政策",
    footerText: "全球首个由AI驱动的去中心化知识产权平台。",
    footerRights: "© {year} MindVaultIP. 基于Base网络构建。",
    footerLine: "基于Base网络构建 | 由AI理事会™提供支持 | © {year} MindVaultIP Ltd."
  },
  hi: {
    dashboard: "डैशबोर्ड",
    expertDashboard: "विशेषज्ञ पैनल",
    gallery: "गैलरी",
    messages: "संदेश",
    marketplace: "बाजार",
    watchlist: "वॉचलिस्ट",
    profile: "प्रोफ़ाइल",
    more: "और",
    tokenFactory: "टोकन फ़ैक्टरी",
    whitePaper: "श्वेतपत्र",
    walletSecurity: "वॉलेट सुरक्षा",
    adminPanel: "एडमिन पैनल",
    platform: "प्लेटफ़ॉर्म",
    createProof: "प्रूफ बनाएं",
    learn: "सीखें",
    legal: "कानूनी",
    termsOfService: "सेवा की शर्तें",
    privacyPolicy: "गोपनीयता नीति",
    footerText: "एआई द्वारा संचालित बौद्धिक संपदा के लिए दुनिया का पहला विकेन्द्रीकृत मंच।",
    footerRights: "© {year} MindVaultIP. बेस नेटवर्क पर निर्मित।",
    footerLine: "बेस नेटवर्क पर निर्मित | एआई काउंसिल™ द्वारा संचालित | © {year} MindVaultIP Ltd."
  },
  es: {
    dashboard: "Panel de control",
    expertDashboard: "Panel de expertos",
    gallery: "Galería",
    messages: "Mensajes",
    aiMentor: "Mentor de IA",
    marketplace: "Mercado",
    watchlist: "Lista de seguimiento",
    profile: "Perfil",
    more: "Más",
    tokenFactory: "Fábrica de tokens",
    whitePaper: "Libro blanco",
    walletSecurity: "Seguridad de la billetera",
    adminPanel: "Panel de administración",
    platform: "Plataforma",
    createProof: "Crear prueba",
    learn: "Aprender",
    legal: "Legal",
    termsOfService: "Términos de Servicio",
    privacyPolicy: "Política de Privacidad",
    footerText: "La primera plataforma descentralizada del mundo para la propiedad intelectual, impulsada por IA.",
    footerRights: "© {year} MindVaultIP. Construido en Base Network.",
    footerLine: "Construido en Base Network | Impulsado por AI Council™ | © {year} MindVaultIP Ltd."
  },
  fr: {
    dashboard: "Tableau de bord",
    expertDashboard: "Panneau d'experts",
    gallery: "Galerie",
    messages: "Messages",
    marketplace: "Marché",
    watchlist: "Liste de surveillance",
    profile: "Profil",
    more: "Plus",
    tokenFactory: "Usine de jetons",
    whitePaper: "Livre blanc",
    walletSecurity: "Sécurité du portefeuille",
    adminPanel: "Panneau d'administration",
    platform: "Plateforme",
    createProof: "Créer une preuve",
    learn: "Apprendre",
    legal: "Légal",
    termsOfService: "Conditions d'utilisation",
    privacyPolicy: "Politique de confidentialité",
    footerText: "La première plateforme décentralisée au monde pour la propriété intellectuelle, alimentée par l'IA.",
    footerRights: "© {year} MindVaultIP. Construit sur Base Network.",
    footerLine: "Construit sur Base Network | Propulsé par AI Council™ | © {year} MindVaultIP Ltd."
  },
  ar: {
    dashboard: "لوحة التحكم",
    expertDashboard: "لوحة الخبراء",
    gallery: "المعرض",
    messages: "الرسائل",
    marketplace: "السوق",
    watchlist: "قائمة المراقبة",
    profile: "الملف الشخصي",
    more: "المزيد",
    tokenFactory: "مصنع الرموز",
    whitePaper: "الورقة البيضاء",
    walletSecurity: "أمان المحفظة",
    adminPanel: "لوحة الإدارة",
    platform: "المنصة",
    createProof: "إنشاء إثبات",
    learn: "تعلم",
    legal: "قانوني",
    termsOfService: "شروط الخدمة",
    privacyPolicy: "سياسة الخصوصية",
    footerText: "أول منصة لامركزية في العالم للملكية الفكرية، مدعومة بالذكاء الاصطناعي.",
    footerRights: "© {year} MindVaultIP. مبنية على شبكة Base.",
    footerLine: "مبنية على شبكة Base | مدعومة من مجلس الذكاء الاصطناعي™ | © {year} MindVaultIP Ltd."
  },
  de: {
    dashboard: "Dashboard",
    expertDashboard: "Expertenpanel",
    gallery: "Galerie",
    messages: "Nachrichten",
    marketplace: "Marktplatz",
    watchlist: "Beobachtungsliste",
    profile: "Profil",
    more: "Mehr",
    tokenFactory: "Token-Fabrik",
    whitePaper: "Whitepaper",
    walletSecurity: "Wallet-Sicherheit",
    adminPanel: "Admin-Panel",
    platform: "Plattform",
    createProof: "Beweis erstellen",
    learn: "Lernen",
    legal: "Rechtliches",
    termsOfService: "Nutzungsbedingungen",
    privacyPolicy: "Datenschutzrichtlinie",
    footerText: "Die weltweit erste dezentrale Plattform für geistiges Eigentum, angetrieben von KI.",
    footerRights: "© {year} MindVaultIP. Auf Base Network aufgebaut.",
    footerLine: "Auf Base Network aufgebaut | Unterstützt von AI Council™ | © {year} MindVaultIP Ltd."
  },
  ur: {
    dashboard: "ڈیش بورڈ",
    expertDashboard: "ماہر پینل",
    gallery: "گیلری",
    messages: "پیغامات",
    marketplace: "مارکیٹ پلیس",
    watchlist: "واچ لسٹ",
    profile: "پروفائل",
    more: "مزید",
    tokenFactory: "ٹوکن فیکٹری",
    whitePaper: "وائٹ پیپر",
    walletSecurity: "والیٹ سیکیورٹی",
    adminPanel: "ایڈمن پینل",
    platform: "پلیٹ فارم",
    createProof: "ثبوت بنائیں",
    learn: "سیکھیں",
    legal: "قانونی",
    termsOfService: "خدمت کی شرائط",
    privacyPolicy: "رازداری کی پالیسی",
    footerText: "مصنوعی ذہانت سے چلنے والا دنیا کا پہلا غیر مرکزی پلیٹ فارم برائے فکری ملکیت۔",
    footerRights: "© {year} MindVaultIP. بیس نیٹ ورک پر بنایا گیا ہے۔",
    footerLine: "بیس نیٹ ورک پر بنایا گیا | اے آئی کونسل™ کے ذریعہ تقویت یافتہ | © {year} MindVaultIP Ltd."
  },
  ru: {
    dashboard: "Панель управления",
    expertDashboard: "Панель экспертов",
    gallery: "Галерея",
    messages: "Сообщения",
    marketplace: "Торговая площадка",
    watchlist: "Список отслеживания",
    profile: "Профиль",
    more: "Еще",
    tokenFactory: "Фабрика токенов",
    whitePaper: "Белая книга",
    walletSecurity: "Безопасность кошелька",
    adminPanel: "Панель администратора",
    platform: "Платформа",
    createProof: "Создать доказательство",
    learn: "Учиться",
    legal: "Юридический",
    termsOfService: "Условия использования",
    privacyPolicy: "Политика конфиденциальности",
    footerText: "Первая в мире децентрализованная платформа для интеллектуальной собственности, работающая на базе ИИ.",
    footerRights: "© {year} MindVaultIP. Создано на сети Base.",
    footerLine: "Создано на сети Base | Работает на базе AI Council™ | © {year} MindVaultIP Ltd."
  },
  ja: {
    dashboard: "ダッシュボード",
    expertDashboard: "専門家パネル",
    gallery: "ギャラリー",
    messages: "メッセージ",
    marketplace: "マーケットプレイス",
    watchlist: "ウォッチリスト",
    profile: "プロフィール",
    more: "その他",
    tokenFactory: "トークンファクトリー",
    whitePaper: "ホワイトペーパー",
    walletSecurity: "ウォレットセキュリティ",
    adminPanel: "管理パネル",
    platform: "プラットフォーム",
    createProof: "証明を作成",
    learn: "学ぶ",
    legal: "法律",
    termsOfService: "利用規約",
    privacyPolicy: "プライバシーポリシー",
    footerText: "AIを搭載した世界初の分散型知的財産プラットフォーム。",
    footerRights: "© {year} MindVaultIP. Baseネットワーク上に構築。",
    footerLine: "Baseネットワーク上に構築 | AI Council™によって強化 | © {year} MindVaultIP Ltd."
  },
  ko: {
    dashboard: "대시보드",
    expertDashboard: "전문가 패널",
    gallery: "갤러리",
    messages: "메시지",
    marketplace: "마켓플레이스",
    watchlist: "관심 목록",
    profile: "프로필",
    more: "더보기",
    tokenFactory: "토큰 팩토리",
    whitePaper: "백서",
    walletSecurity: "지갑 보안",
    adminPanel: "관리자 패널",
    platform: "플랫폼",
    createProof: "증명 생성",
    learn: "학습",
    legal: "법률",
    termsOfService: "서비스 약관",
    privacyPolicy: "개인정보처리방침",
    footerText: "AI 기반의 세계 최초 분산형 지적 재산 플랫폼.",
    footerRights: "© {year} MindVaultIP. Base 네트워크 기반으로 구축.",
    footerLine: "Base 네트워크 기반으로 구축 | AI Council™ 지원 | © {year} MindVaultIP Ltd."
  },
  sw: {
    dashboard: "Dashibodi",
    expertDashboard: "Jopo la Wataalam",
    gallery: "Nyumba ya Sanaa",
    messages: "Ujumbe",
    marketplace: "Soko",
    watchlist: "Orodha ya Kutazama",
    profile: "Profaili",
    more: "Zaidi",
    tokenFactory: "Kiwanda cha Tokeni",
    whitePaper: "Karatasi Nyeupe",
    walletSecurity: "Usalama wa Wallet",
    platform: "Jukwaa",
    createProof: "Unda Ushahidi",
    learn: "Jifunze",
    legal: "Kisheria",
    termsOfService: "Masharti ya Huduma",
    privacyPolicy: "Sera ya Faragha",
    footerText: "Jukwaa la kwanza duniani lililogatuliwa kwa mali miliki, linaloendeshwa na AI.",
    footerRights: "© {year} MindVaultIP. Imejengwa kwenye Mtandao wa Base.",
    footerLine: "Imejengwa kwenye Mtandao wa Base | Inaendeshwa na AI Council™ | © {year} MindVaultIP Ltd."
  },
  ha: {
    dashboard: "Dashboard",
    expertDashboard: "Kwamitin Masana",
    gallery: "Gallery",
    messages: "Saƙonni",
    marketplace: "Kasuwa",
    watchlist: "Jerin Kallo",
    profile: "Furofayil",
    more: "Ƙari",
    tokenFactory: "Ma'aikatar Token",
    whitePaper: "Farar Takarda",
    walletSecurity: "Tsaron Wallet",
    adminPanel: "Kwamitin Gudanarwa",
    platform: "Platform",
    createProof: "Ƙirƙiri Tabbaci",
    learn: "Koyi",
    legal: "Shari'a",
    termsOfService: "Sharuɗɗan Sabis",
    privacyPolicy: "Tsarin Sirri",
    footerText: "Farkon dandamali na duniya mara tushe don mallakar ilimi, wanda AI ke tafiyar da shi.",
    footerRights: "© {year} MindVaultIP. An gina shi akan Base Network.",
    footerLine: "An gina shi akan Base Network | An yi amfani da shi ta AI Council™ | © {year} MindVaultIP Ltd."
  },
  yo: {
    dashboard: "Dasibodu",
    expertDashboard: "Panaali Amoye",
    gallery: "Àwòrán",
    messages: "Awọn ifiranṣẹ",
    marketplace: "Ọjà",
    watchlist: "Àkójọ àtẹ̀lé",
    profile: "Profaili",
    more: "Diẹ sii",
    tokenFactory: "Ilé iṣẹ́ Token",
    whitePaper: "Iwe funfun",
    walletSecurity: "Ìbàjẹ́ àpò-ìfọwọ́ra",
    adminPanel: "Panaali Aláṣẹ",
    platform: "Páríbá",
    createProof: "Ṣẹda Ẹri",
    learn: "Kọ́",
    legal: "Òfin",
    termsOfService: "Àwọn Ìlànà Iṣẹ́",
    privacyPolicy: "Ìlànà Ìpamọ́",
    footerText: "Sànàkúà ti àkọ́kọ́ ní àgbáyé fún àwọn ohun-ìní ọgbọ́n, tí AI fi ń ṣiṣẹ́.",
    footerRights: "© {year} MindVaultIP. Ti kọ lori Base Network.",
    footerLine: "Ti kọ lori Base Network | Ní agbára pẹ̀lú AI Council™ | © {year} MindVaultIP Ltd."
  },
  tr: {
    dashboard: "Kontrol Paneli",
    expertDashboard: "Uzman Paneli",
    gallery: "Galeri",
    messages: "Mesajlar",
    marketplace: "Pazar Yeri",
    watchlist: "İzleme Listesi",
    profile: "Profil",
    more: "Daha Fazla",
    tokenFactory: "Token Fabrikası",
    whitePaper: "Teknik Rapor",
    walletSecurity: "Cüzdan Güvenliği",
    adminPanel: "Yönetici Paneli",
    platform: "Platform",
    createProof: "Kanıt Oluştur",
    learn: "Öğren",
    legal: "Yasal",
    termsOfService: "Hizmet Şartları",
    privacyPolicy: "Gizlilik Politikası",
    footerText: "Yapay zeka destekli, fikri mülkiyet için dünyanın ilk merkezi olmayan platformu.",
    footerRights: "© {year} MindVaultIP. Base Ağı Üzerine Kurulmuştur.",
    footerLine: "Base Ağı Üzerine Kurulmuştur | AI Council™ Tarafından Desteklenmektedir | © {year} MindVaultIP Ltd."
  },
  bal: {
    dashboard: 'ڈیشبورڈ',
    expertDashboard: 'ماہرین پینل',
    gallery: 'گالری',
    messages: 'پیغام',
    marketplace: 'بازار',
    watchlist: 'میری فہرست',
    profile: 'پروفائل',
    more: 'مزید',
    tokenFactory: 'ٹوکن فیکٹری',
    whitePaper: 'وائٹ پیپر',
    walletSecurity: 'والٹ سیکیورٹی',
    adminPanel: 'ایڈمن پینل',
    platform: 'پلیٹ فارم',
    createProof: 'ثبوت بنائیں',
    learn: 'سیکھیں',
    legal: 'قانونی',
    termsOfService: "سروس کے شرائط",
    privacyPolicy: "رازداری کی پالیسی",
    footerText: "مصنوعی ذہانت سے چلنے والا دنیا کا پہلا غیر مرکزی پلیٹ فارم برائے فکری ملکیت۔",
    footerRights: "© {year} MindVaultIP. بیس نیٹ ورک پر بنایا گیا ہے۔",
    footerLine: "بیس نیٹ ورک پر بنایا گیا | اے آئی کونسل™ کے ذریعہ تقویت یافتہ | © {year} MindVaultIP Ltd."
  },
};

    // Use centralized language configuration
    const languages = SUPPORTED_LOCALES.map(code => ({
        code,
        name: getLanguageName(code)
    }));

function AppLayout({ children, currentPageName }) {
  const location = useLocation();
  const [userRole, setUserRole] = useState('user');
  const [language, setLanguage] = useState(getCurrentLocale());
  const [headerHeight, setHeaderHeight] = useState(80);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileNavRef = useRef(null);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileNavScroll = () => {
    if (mobileNavRef.current) {
      sessionStorage.setItem('mobileNavScrollPos', mobileNavRef.current.scrollLeft);
    }
  };

  useLayoutEffect(() => {
    if (mobileNavRef.current) {
      const savedPos = sessionStorage.getItem('mobileNavScrollPos');
      if (savedPos !== null) {
        mobileNavRef.current.scrollLeft = parseInt(savedPos, 10);
      }
    }
  }, [currentPageName]);

  useEffect(() => {
    const headerElement = document.querySelector('header');
    if (headerElement) {
      const updateHeaderHeight = () => setHeaderHeight(headerElement.offsetHeight);
      updateHeaderHeight();
      window.addEventListener('resize', updateHeaderHeight);
      return () => window.removeEventListener('resize', updateHeaderHeight);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check if user is likely authenticated before making the call
        // This prevents unnecessary 403 errors from being logged
        const hasAuthToken = localStorage.getItem('base44_auth_token') || 
                           sessionStorage.getItem('base44_auth_token') ||
                           document.cookie.includes('base44_auth');
        
        if (!hasAuthToken) {
          // No auth token found, skip the API call to prevent 403 error
          setUserRole('user');
          return;
        }
        
        // Use safe API call to prevent errors from breaking the app
        const user = await safeBase44Auth(() => base44.auth.me(), null);
        if (user && user.role) {
          setUserRole(user.role);
        } else {
          setUserRole('user');
        }
      } catch (error) {
        // Handle authentication errors gracefully - don't log expected 403 errors
        if (error?.status !== 403 && error?.response?.status !== 403) {
          console.warn('User authentication check failed:', error);
        }
        setUserRole('user'); // Default to user role
      }
    };
    
    // Only check user if we're in a browser environment
    if (typeof window !== 'undefined') {
      checkUser();
    }
  }, []); 
  
  // Listen for language changes from other components
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(getCurrentLocale());
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const toggleLanguage = (lang) => {
    // Use centralized language setting
    setLocale(lang);
    setLanguage(lang);
  };
  
  const t = translations[language] || translations.en;
  
      const mainNavItems = [
        { name: ['fa', 'ar', 'ur', 'bal'].includes(language) ? 'خانه' : 'Home', icon: Home, page: 'Landing' },
        { name: t.dashboard, icon: LayoutDashboard, page: 'Dashboard' },
        { name: t.createProof, icon: PlusCircle, page: 'CreateProof' },
        { name: t.gallery, icon: Compass, page: 'Gallery' },
        { name: t.watchlist, icon: List, page: 'Watchlist' },
        { name: t.profile, icon: User, page: 'Profile' },
        ...(FEATURE_EXPERT_DASHBOARD ? [{ name: t.expertDashboard, icon: UserCog, page: 'ExpertDashboard' }] : []),
      ];

      const moreNavItems = [
        ...(FEATURE_MESSAGES ? [{ name: t.messages, icon: MessageSquare, page: 'Messages' }] : []),
        ...(FEATURE_AI_MENTOR ? [{ name: t.aiMentor, icon: Bot, page: 'AIMentor' }] : []),
        ...(FEATURE_MARKETPLACE ? [{ name: t.marketplace, icon: ShoppingCart, page: 'Marketplace' }] : []),
        { name: t.whitePaper, icon: BookOpen, page: 'MindVaultIPWhitePaper' },
        { name: t.walletSecurity, icon: Shield, page: 'WalletSecurity' },
      ];

  const finalMoreNavItems = (userRole === 'admin' && FEATURE_ADMIN_PANEL)
    ? [...moreNavItems, { name: t.adminPanel, icon: UserCog, page: 'AdminPanel' }] 
    : moreNavItems;

  const fullScreenPages = [
    ...(FEATURE_AI_MENTOR ? ['AIMentor'] : []),
    ...(FEATURE_MESSAGES ? ['Messages'] : [])
  ];
  const isFullScreenPage = fullScreenPages.includes(currentPageName);
    
  return (
    <ErrorBoundary>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap');
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
              
              :root {
                --primary-blue: #2F80FF;
                --electric-blue: #00E5FF;
                --dark-bg: #0B1220;
                --card-bg: #1a2332;
                --border-color: rgba(255, 255, 255, 0.1);
              }

              body {
                background: var(--dark-bg);
                color: white;
                font-family: ${
                  {
                    fa: "'Vazirmatn', sans-serif",
                    ur: "'Noto Nastaliq Urdu', serif",
                    ar: "'Noto Naskh Arabic', serif",
                    bal: "'Noto Nastaliq Urdu', serif",
                  }[language] || "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                };
              }

              .glow-card {
                background: linear-gradient(135deg, rgba(47, 128, 255, 0.1) 0%, rgba(0, 229, 255, 0.05) 100%);
                border: 1px solid var(--border-color);
                backdrop-filter: blur(20px);
                transition: all 0.3s ease;
              }

              .glow-card:hover {
                border-color: rgba(47, 128, 255, 0.3);
                box-shadow: 0 8px 32px rgba(47, 128, 255, 0.1);
              }

              .gradient-text {
                background: linear-gradient(135deg, var(--primary-blue) 0%, var(--electric-blue) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }

              .main-content {
                padding-top: ${headerHeight}px;
              }
              
              .main-content-fullscreen {
                padding-top: ${headerHeight}px;
                height: 100vh;
                display: flex;
                flex-direction: column;
              }
              
              .main-content-fullscreen > * {
                flex-grow: 1;
                min-height: 0;
              }

              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }

              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }

              /* Header Glow Effect */
              .header-glow {
                position: relative;
              }

              .header-glow::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(90deg, 
                  transparent 0%, 
                  rgba(47, 128, 255, 0.1) 50%, 
                  transparent 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
              }

              .header-glow:hover::before {
                opacity: 1;
              }

              /* Logo Glow Animation */
              @keyframes pulse-glow {
                0%, 100% {
                  box-shadow: 0 0 20px rgba(47, 128, 255, 0.4);
                }
                50% {
                  box-shadow: 0 0 30px rgba(0, 229, 255, 0.6);
                }
              }

              .logo-glow {
                animation: pulse-glow 3s ease-in-out infinite;
              }
            `}
          </style>
          
          <div className="min-h-screen bg-[#0B1220]">
            {/* Header - Improved Version */}
            <header 
              className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled 
                  ? 'bg-[#0B1220]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
                  : 'bg-transparent'
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                  {/* App Title */}
                  <Link 
                    to={createPageUrl("Landing")} 
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        MindVaultIP
                      </h1>
                      <p className="text-[10px] text-gray-400 -mt-1">Where Ideas Have No Borders</p>
                    </div>
                  </Link>

                  {/* Desktop Navigation */}
                  <nav className="hidden lg:flex items-center gap-1">
                    {mainNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPageName === item.page;
                      
                      return (
                        <Link
                          key={item.name}
                          to={createPageUrl(item.page)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                    
                    {/* More Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-2 py-1 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300">
                          <MoreHorizontal className="w-2 h-2" />
                          <span className="text-sm font-medium">{t.more}</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a2332] border-gray-700 min-w-[200px]">
                        <DropdownMenuLabel className="text-gray-400">{t.more}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        {finalMoreNavItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <DropdownMenuItem key={item.name} asChild>
                              <Link 
                                to={createPageUrl(item.page)}
                                className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer"
                              >
                                <Icon className="w-4 h-4" />
                                <span>{item.name}</span>
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </nav>

                  {/* Right Side Actions - دکمه‌های زبان و کیف پول اینجا هستند */}
                  <div className="flex items-center gap-3">
                    {/* Language Selector - همیشه نمایش داده می‌شود */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all w-10 h-10"
                        >
                          <Languages className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a2332] border-gray-700">
                        {languages.map((langItem) => (
                          <DropdownMenuItem
                            key={langItem.code}
                            onClick={() => toggleLanguage(langItem.code)}
                            className={`text-gray-300 hover:text-white cursor-pointer ${
                              language === langItem.code ? 'bg-blue-600/20 text-blue-400' : ''
                            }`}
                          >
                            {langItem.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Wallet Connect - همیشه نمایش داده می‌شود */}
                    <UnifiedWalletConnect />

                    {/* Mobile Menu Button */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                      ) : (
                        <Menu className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                  <>
                    {/* Overlay Background */}
                    <div 
                      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                      onClick={() => setMobileMenuOpen(false)}
                    />
                    
                    {/* Menu Content */}
                    <div className="fixed inset-x-0 top-20 bottom-0 bg-[#0B1220] z-50 overflow-y-auto">
                      <div className="py-1 border-t border-white/10">
                        <nav className="flex flex-col gap-2 px-4">
                          {mainNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPageName === item.page;
                            
                            return (
                              <Link
                                key={item.name}
                                to={createPageUrl(item.page)}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-1 py-1.5 rounded-md transition-all ${
                                  isActive
                                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <Icon className="w-2 h-2" />
                                <span className="text-sm font-medium">{item.name}</span>
                              </Link>
                            );
                          })}
                          
                          {/* More items in mobile */}
                          <div className="border-t border-gray-700 my-2 pt-2">
                            {finalMoreNavItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.name}
                                  to={createPageUrl(item.page)}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center gap-3 px-1 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                                >
                                  <Icon className="w-2 h-2" />
                                  <span className="text-sm font-medium">{item.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </nav>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </header>

            <main className={isFullScreenPage ? 'main-content-fullscreen' : 'main-content'}>
              {children}
            </main>

            {/* Footer has been removed as per the new design */}

          </div>
    </ErrorBoundary>
  );
}

export default AppLayout;
