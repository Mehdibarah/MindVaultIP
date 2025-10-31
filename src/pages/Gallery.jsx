
import React, { useState, useEffect, useMemo } from "react";
import { Proof } from "@/services/entities";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Filter, Users, AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ProofCard from "../components/dashboard/ProofCard";

const translations = {
  en: {
    title: 'Proof Gallery',
    subtitle: 'Explore publicly registered ideas and inventions from around the globe.',
    totalProofs: 'Total Proofs',
    investmentReady: 'AI Approved',
    pendingReview: 'Pending AI Review',
    searchPlaceholder: 'Search proofs...',
    allCategories: 'All Categories',
    invention: 'New Inventions',
    discovery: 'Discoveries',
    research: 'Research',
    patent: 'Official Patents',
    brand: 'Brands',
    logo: 'Logos',
    trademark: 'Trademarks',
    idea: 'Ideas',
    document: 'Document',
    other: 'Other',
    allStatus: 'All Status',
    aiApproved: '✅ AI Approved',
    pendingAiReview: '⏳ Pending Review',
    notApproved: '❌ Not Approved',
    clearFilters: 'Clear Filters',
    noResultsTitle: 'No Public Proofs Found',
    noResultsDesc: 'Check back later to see new innovations from the community.',
    clearAllFilters: 'Clear All Filters',
    loadingInnovations: 'Loading innovations...',
    sortBy: 'Sort by:',
    newest: 'Newest',
    oldest: 'Oldest',
    mostViewed: 'Most Viewed',
    categoryFilter: 'Category:',
    viewDetails: 'View Details',
  },
  fa: {
    title: 'گالری گواهی‌ها',
    subtitle: 'ایده‌ها و اختراعات ثبت شده عمومی از سراسر جهان را کاوش کنید.',
    totalProofs: 'کل گواهی‌ها',
    investmentReady: 'تایید شده توسط هوش مصنوعی',
    pendingReview: 'در انتظار بررسی هوش مصنوعی',
    searchPlaceholder: 'جستجوی گواهی‌ها...',
    allCategories: 'همه دسته‌بندی‌ها',
    invention: 'اختراعات جدید',
    discovery: 'کشفیات',
    research: 'تحقیقات',
    patent: 'پتنت‌های رسمی',
    brand: 'برندها',
    logo: 'لوگوها',
    trademark: 'علامت تجاری',
    idea: 'ایده‌ها',
    document: 'داکیومنت',
    other: 'سایر',
    allStatus: 'همه وضعیت‌ها',
    aiApproved: '✅ تایید شده',
    pendingAiReview: '⏳ در انتظار بررسی',
    notApproved: '❌ تایید نشده',
    clearFilters: 'پاک کردن فیلترها',
    noResultsTitle: 'هیچ گواهی عمومی یافت نشد',
    noResultsDesc: 'برای دیدن نوآوری‌های جدید از جامعه، بعداً دوباره بررسی کنید.',
    clearAllFilters: 'پاک کردن همه فیلترها',
    loadingInnovations: 'بارگیری نوآوری‌ها...',
    sortBy: 'مرتب‌سازی بر اساس:',
    newest: 'جدیدترین',
    oldest: 'قدیمی‌ترین',
    mostViewed: 'بیشترین بازدید',
    categoryFilter: 'دسته بندی:',
    viewDetails: 'مشاهده جزئیات',
  },
  zh: {
    title: '证明画廊',
    subtitle: '探索来自全球的公开注册的想法和发明。',
    totalProofs: '总证明',
    investmentReady: 'AI 批准',
    pendingReview: '待 AI 审核',
    searchPlaceholder: '搜索证明...',
    allCategories: '所有类别',
    invention: '新发明',
    discovery: '发现',
    research: '研究',
    patent: '官方专利',
    brand: '品牌',
    logo: '徽标',
    trademark: '商标',
    idea: '想法',
    document: '文档',
    other: '其他',
    allStatus: '所有状态',
    aiApproved: '✅ AI 已批准',
    pendingAiReview: '⏳ 待审核',
    notApproved: '❌ 未批准',
    clearFilters: '清除筛选器',
    noResultsTitle: '未找到公开证明',
    noResultsDesc: '请稍后回来查看社区的新创新。',
    clearAllFilters: '清除所有筛选器',
    loadingInnovations: '正在加载创新...',
    sortBy: '排序方式：',
    newest: '最新',
    oldest: '最旧',
    mostViewed: '最多观看',
    categoryFilter: '类别:',
    viewDetails: '查看详情',
  },
  hi: {
    title: 'प्रमाण गैलरी',
    subtitle: 'दुनिया भर से सार्वजनिक रूप से पंजीकृत विचारों और आविष्कारों का अन्वेषण करें।',
    totalProofs: 'कुल प्रमाण',
    investmentReady: 'AI स्वीकृत',
    pendingReview: 'AI समीक्षा लंबित',
    searchPlaceholder: 'प्रमाण खोजें...',
    allCategories: 'सभी श्रेणियां',
    invention: 'नए आविष्कार',
    discovery: 'खोजें',
    research: 'अनुसंधान',
    patent: 'आधिकारिक पेटेंट',
    brand: 'ब्रांड',
    logo: 'लोगो',
    trademark: 'ट्रेडमार्क',
    idea: 'विचार',
    document: 'दस्तावेज़',
    other: 'अन्य',
    allStatus: 'सभी स्थिति',
    aiApproved: '✅ AI स्वीकृत',
    pendingAiReview: '⏳ समीक्षा लंबित',
    notApproved: '❌ अस्वीकृत',
    clearFilters: 'फ़िल्टर साफ़ करें',
    noResultsTitle: 'कोई सार्वजनिक प्रमाण नहीं मिला',
    noResultsDesc: 'समुदाय से नए नवाचारों को देखने के लिए बाद में फिर से देखें।',
    clearAllFilters: 'सभी फ़िल्टर साफ़ करें',
    loadingInnovations: 'नवाचार लोड हो रहा है...',
    sortBy: 'इसके अनुसार क्रमबद्ध करें:',
    newest: 'नवीनतम',
    oldest: 'सबसे पुराना',
    mostViewed: 'सबसे ज्यादा देखे गए',
    categoryFilter: 'श्रेणी:',
    viewDetails: 'विवरण देखें',
  },
  ur: {
    title: 'ثبوت گیلری',
    subtitle: 'دنیا بھر سے عوامی طور پر رجسٹرڈ نظریات اور ایجادات کو دریافت کریں۔',
    totalProofs: 'کل ثبوت',
    investmentReady: 'AI منظور شدہ',
    pendingReview: 'AI جائزہ زیر التوا',
    searchPlaceholder: 'ثبوت تلاش کریں...',
    allCategories: 'تمام اقسام',
    invention: 'نئی ایجادات',
    discovery: 'دریافتیں',
    research: 'تحقیقات',
    patent: 'سرکاری پیٹنٹ',
    brand: 'برانڈز',
    logo: 'لوگوز',
    trademark: 'تجارتی نشان',
    idea: 'نظریات',
    other: 'دیگر',
    allStatus: 'تمام حیثیت',
    aiApproved: '✅ AI منظور شدہ',
    pendingAiReview: '⏳ جائزہ زیر التوا',
    notApproved: '❌ منظور نہیں',
    clearFilters: 'فلٹرز صاف کریں',
    noResultsTitle: 'کوئی عوامی ثبوت نہیں ملا',
    noResultsDesc: 'کمیونٹی سے نئی ایجادات دیکھنے کے لیے بعد میں دوبارہ چیک کریں۔',
    clearAllFilters: 'تمام فلٹرز صاف کریں',
    loadingInnovations: 'جدتیں لوڈ ہو رہی ہیں...',
    sortBy: 'ترتیب دیں:',
    newest: 'تازہ ترین',
    oldest: 'قدیم ترین',
    mostViewed: 'سب سے زیادہ دیکھے گئے',
    categoryFilter: 'زمرہ:',
    viewDetails: 'تفصیلات دیکھیں',
  },
  de: {
    title: 'Öffentliche Galerie der Nachweise',
    subtitle: 'Entdecken Sie die neuesten öffentlich registrierten Ideen, Erfindungen und Marken.',
    totalProofs: 'Gesamtzahl der Nachweise',
    investmentReady: 'KI-genehmigt',
    pendingReview: 'KI-Überprüfung ausstehend',
    searchPlaceholder: 'Nachweise durchsuchen...',
    allCategories: 'Alle Kategorien',
    invention: 'Erfindung',
    discovery: 'Entdeckungen',
    research: 'Forschung',
    patent: 'Offizielle Patente',
    brand: 'Marke',
    logo: 'Logos',
    trademark: 'Markenzeichen',
    idea: 'Idee',
    design: 'Design',
    document: 'Dokument',
    other: 'Andere',
    allStatus: 'Alle Status',
    aiApproved: '✅ KI-genehmigt',
    pendingAiReview: '⏳ Überprüfung ausstehend',
    notApproved: '❌ Nicht genehmigt',
    clearFilters: 'Filter löschen',
    noResultsTitle: 'Keine Nachweise gefunden',
    noResultsDesc: 'Es scheint keine öffentlichen Nachweise zu geben, die Ihren Kriterien entsprechen. Warum nicht der Erste sein?',
    clearAllFilters: 'Alle Filter löschen',
    loadingInnovations: 'Innovationen werden geladen...',
    sortBy: 'Sortieren nach',
    newest: 'Neueste zuerst',
    oldest: 'Älteste zuerst',
    mostViewed: 'Am häufigsten angesehen',
    categoryFilter: 'Kategorie',
    viewDetails: 'Details ansehen',
    createFirstProof: 'Ihren ersten Nachweis erstellen',
  },
  bal: {
    title: 'گواهیانی پبلک گیلری',
    subtitle: 'نوکترین پبلک رجسٹرڈ آئیڈیا، ایجادات ءُ برانڈز ءَ دریافت کن ات.',
    totalProofs: 'کل گواهی',
    investmentReady: 'AI تایید کُتگیں',
    pendingReview: 'AI بررسی ءِ انتظار ءَ',
    searchPlaceholder: 'گواهیانی تہ ءَ شوہاز کن...',
    allCategories: 'کل دسته‌بندی',
    invention: 'ایجاد',
    discovery: 'دریافت',
    research: 'پٹ و پول',
    patent: 'رسمی پیٹنٹ',
    brand: 'برانڈ',
    logo: 'لوگو',
    trademark: 'تجارتی نشان',
    idea: 'آئیڈیا',
    design: 'ڈیزائن',
    other: 'دگہ',
    allStatus: 'کل حالتاں',
    aiApproved: '✅ AI تایید کُتگیں',
    pendingAiReview: '⏳ بررسی ءِ انتظار ءَ',
    notApproved: '❌ تایید نه کُتگیں',
    clearFilters: 'فلٹر پاک کن',
    noResultsTitle: 'هچ گواهی در نہ کپت',
    noResultsDesc: 'چُشکہ گندگ ءَ کیت کہ هچ پبلک گواهی تئی معیار ءَ گوں مطابقت نہ کنت. چیا نہ کہ اولی کس بئے؟',
    clearAllFilters: 'کل فلٹر پاک کن',
    loadingInnovations: 'نوکیں ایجادات لوڈ کنگ ءَ انت...',
    sortBy: 'ترتیب دیگ ءِ اساس',
    newest: 'نوکترین اول',
    oldest: 'پیشیترین اول',
    mostViewed: 'گیشترین چارگ بیتگ',
    categoryFilter: 'دسته‌بندی',
    viewDetails: 'جزئیات چار',
    createFirstProof: 'وتی اولی گواهی ءَ جوڑ کن'
  },
  fr: {
    title: 'Galerie des preuves',
    subtitle: 'Explorez les idées et inventions enregistrées publiquement du monde entier.',
    totalProofs: 'Total des preuves',
    investmentReady: 'Approuvé par l\'IA',
    pendingReview: 'En attente d\'examen par l\'IA',
    searchPlaceholder: 'Rechercher des preuves...',
    allCategories: 'Toutes catégories',
    invention: 'Nouvelles inventions',
    discovery: 'Découvertes',
    research: 'Recherche',
    patent: 'Brevets officiels',
    brand: 'Marques',
    logo: 'Logos',
    trademark: 'Marques déposées',
    idea: 'Idées',
    other: 'Autre',
    allStatus: 'Tous les statuts',
    aiApproved: '✅ Approuvé par l\'IA',
    pendingAiReview: '⏳ En attente d\'examen',
    notApproved: '❌ Non approuvé',
    clearFilters: 'Effacer les filtres',
    noResultsTitle: 'Aucune preuve publique trouvée',
    noResultsDesc: 'Revenez plus tard pour voir les nouvelles innovations de la communauté.',
    clearAllFilters: 'Effacer tous les filtres',
    loadingInnovations: 'Chargement des innovations...',
    sortBy: 'Trier par :',
    newest: 'Plus récent',
    oldest: 'Plus ancien',
    mostViewed: 'Le plus consulté',
    categoryFilter: 'Catégorie:',
    viewDetails: 'Voir les détails',
  },
  es: {
    title: 'Galería de Pruebas',
    subtitle: 'Explore ideas e invenciones registradas públicamente de todo el mundo.',
    totalProofs: 'Total de Pruebas',
    investmentReady: 'Aprobado por IA',
    pendingReview: 'Pendiente de revisión por IA',
    searchPlaceholder: 'Buscar pruebas...',
    allCategories: 'Todas las categorías',
    invention: 'Nuevas invenciones',
    discovery: 'Descubrimientos',
    research: 'Investigación',
    patent: 'Patentes oficiales',
    brand: 'Marcas',
    logo: 'Logos',
    trademark: 'Marcas registradas',
    idea: 'Ideas',
    other: 'Otro',
    allStatus: 'Todos los estados',
    aiApproved: '✅ Aprobado por IA',
    pendingAiReview: '⏳ Pendiente de revisión',
    notApproved: '❌ No aprobado',
    clearFilters: 'Borrar filtros',
    noResultsTitle: 'No se encontraron pruebas públicas',
    noResultsDesc: 'Vuelva más tarde para ver nuevas innovaciones de la comunidad.',
    clearAllFilters: 'Borrar todos los filtros',
    loadingInnovations: 'Cargando innovaciones...',
    sortBy: 'Ordenar por:',
    newest: 'Más reciente',
    oldest: 'Más antiguo',
    mostViewed: 'Más visto',
    categoryFilter: 'Categoría:',
    viewDetails: 'Ver detalles',
  },
  ar: {
    title: 'معرض الإثباتات',
    subtitle: 'استكشف عالمًا من الابتكار. تصفح الإثباتات العامة من جميع أنحاء العالم.',
    totalProofs: 'إجمالي الإثباتات',
    investmentReady: 'معتمد من الذكاء الاصطناعي',
    pendingReview: 'في انتظار مراجعة الذكاء الاصطناعي',
    searchPlaceholder: 'ابحث عن الإثباتات حسب العنوان أو العلامة...',
    allCategories: 'جميع الفئات',
    invention: 'اختراعات جديدة',
    discovery: 'اكتشافات',
    research: 'بحث',
    patent: 'براءات اختراع رسمية',
    brand: 'ماركات',
    logo: 'شعارات',
    trademark: 'علامات تجارية',
    idea: 'أفكار',
    other: 'أخرى',
    allStatus: 'جميع الحالات',
    aiApproved: '✅ معتمد من الذكاء الاصطناعي',
    pendingAiReview: '⏳ قيد المراجعة',
    notApproved: '❌ غير معتمد',
    clearFilters: 'مسح الفلاتر',
    noResultsTitle: 'لم يتم العثور على إثباتات عامة',
    noResultsDesc: 'لم يقم أي مستخدمين بجعل إثباتاتهم عامة بعد. تحقق مرة أخرى قريبًا!',
    clearAllFilters: 'مسح جميع الفلاتر',
    loadingInnovations: 'جاري تحميل الابتكارات...',
    sortBy: 'فرز حسب:',
    newest: 'الأحدث',
    oldest: 'الأقدم',
    mostViewed: 'الأكثر مشاهدة',
    categoryFilter: 'الفئة:',
    viewDetails: 'عرض التفاصيل',
  },
  ru: {
    title: 'Галерея доказательств',
    subtitle: 'Исследуйте публично зарегистрированные идеи и изобретения со всего мира.',
    totalProofs: 'Всего доказательств',
    investmentReady: 'Одобрено ИИ',
    pendingReview: 'На рассмотрении ИИ',
    searchPlaceholder: 'Поиск доказательств...',
    allCategories: 'Все категории',
    invention: 'Новые изобретения',
    discovery: 'Открытия',
    research: 'Исследования',
    patent: 'Официальные патенты',
    brand: 'Бренды',
    logo: 'Логотипы',
    trademark: 'Торговые марки',
    idea: 'Идеи',
    other: 'Прочее',
    allStatus: 'Все статусы',
    aiApproved: '✅ Одобрено ИИ',
    pendingAiReview: '⏳ На рассмотрении',
    notApproved: '❌ Не одобрено',
    clearFilters: 'Очистить фильтры',
    noResultsTitle: 'Публичные доказательства не найдены',
    noResultsDesc: 'Загляните позже, чтобы увидеть новые инновации от сообщества.',
    clearAllFilters: 'Очистить все фильтры',
    loadingInnovations: 'Загрузка инноваций...',
    sortBy: 'Сортировать по:',
    newest: 'Самые новые',
    oldest: 'Самые старые',
    mostViewed: 'Самые просматриваемые',
    categoryFilter: 'Категория:',
    viewDetails: 'Посмотреть детали',
  },
  ja: {
    title: '証明ギャラリー',
    subtitle: '世界中から公に登録されたアイデアや発明を探ります。',
    totalProofs: '合計証明数',
    investmentReady: 'AI承認済み',
    pendingReview: 'AIレビュー待ち',
    searchPlaceholder: '証明を検索...',
    allCategories: 'すべてのカテゴリー',
    invention: '新しい発明',
    discovery: '発見',
    research: '研究',
    patent: '公式特許',
    brand: 'ブランド',
    logo: 'ロゴ',
    trademark: '商標',
    idea: 'アイデア',
    other: 'その他',
    allStatus: 'すべてのステータス',
    aiApproved: '✅ AI承認済み',
    pendingAiReview: '⏳ レビュー待ち',
    notApproved: '❌ 未承認',
    clearFilters: 'フィルターをクリア',
    noResultsTitle: '公開証明が見つかりません',
    noResultsDesc: 'コミュニティからの新しいイノベーションを見るために、後でもう一度確認してください。',
    clearAllFilters: 'すべてのフィルターをクリア',
    loadingInnovations: 'イノベーションを読み込み中...',
    sortBy: '並べ替え:',
    newest: '新着順',
    oldest: '古い順',
    mostViewed: '最も閲覧された',
    categoryFilter: 'カテゴリ:',
    viewDetails: '詳細を見る',
  },
  ko: {
    title: '증명 갤러리',
    subtitle: '전 세계에서 공개적으로 등록된 아이디어와 발명품을 탐색하세요.',
    totalProofs: '총 증명',
    investmentReady: 'AI 승인',
    pendingReview: 'AI 검토 대기 중',
    searchPlaceholder: '증명 검색...',
    allCategories: '모든 카테고리',
    invention: '새로운 발명',
    discovery: '발견',
    research: '연구',
    patent: '공식 특허',
    brand: '브랜드',
    logo: '로고',
    trademark: '상표',
    idea: '아이디어',
    other: '기타',
    allStatus: '모든 상태',
    aiApproved: '✅ AI 승인',
    pendingAiReview: '⏳ 검토 대기 중',
    notApproved: '❌ 미승인',
    clearFilters: '필터 지우기',
    noResultsTitle: '공개된 증명을 찾을 수 없습니다',
    noResultsDesc: '커뮤니티의 새로운 혁신을 보려면 나중에 다시 확인하세요.',
    clearAllFilters: '모든 필터 지우기',
    loadingInnovations: '혁신 로드 중...',
    sortBy: '정렬 기준:',
    newest: '최신순',
    oldest: '오래된순',
    mostViewed: '가장 많이 본',
    categoryFilter: '카테고리:',
    viewDetails: '세부 정보 보기',
  },
  sw: {
    title: 'Matunzio ya Uthibitisho',
    subtitle: 'Gundua mawazo na uvumbuzi uliosajiliwa hadharani kutoka kote ulimwenguni.',
    totalProofs: 'Jumla ya Uthibitisho',
    investmentReady: 'Imeidhinishwa na AI',
    pendingReview: 'Inasubiri Mapitio ya AI',
    searchPlaceholder: 'Tafuta uthibitisho...',
    allCategories: 'Kategoria Zote',
    invention: 'Uvumbuzi Mpya',
    discovery: 'Uvumbuzi',
    research: 'Utafiti',
    patent: 'Hati Miliki Rasmi',
    brand: 'Bidhaa',
    logo: 'Alama',
    trademark: 'Alama za Biashara',
    idea: 'Mawazo',
    other: 'Nyingine',
    allStatus: 'Hali Zote',
    aiApproved: '✅ Imeidhinishwa na AI',
    pendingAiReview: '⏳ Inasubiri Mapitio',
    notApproved: '❌ Haijaidhinishwa',
    clearFilters: 'Futa Vichujio',
    noResultsTitle: 'Hakuna Uthibitisho wa Umma Uliopatikana',
    noResultsDesc: 'Angalia tena baadaye ili kuona ubunifu mpya kutoka kwa jamii.',
    clearAllFilters: 'Futa Vichujio Vyote',
    loadingInnovations: 'Inapakia uvumbuzi...',
    sortBy: 'Panga kwa:',
    newest: 'Mpya zaidi',
    oldest: 'Za zamani zaidi',
    mostViewed: 'Iliyotazamwa Zaidi',
    categoryFilter: 'Kategoria:',
    viewDetails: 'Tazama Maelezo',
  },
  ha: {
    title: 'Gallery na Tabbaci',
    subtitle: 'Binciko ra\'ayoyi da ƙirƙire-ƙirƙire da aka yi wa rajista a bainar jama\'a daga ko\'ina cikin duniya.',
    totalProofs: 'Jimlar Tabbaci',
    investmentReady: 'AI Ya Amince',
    pendingReview: 'Jira Binciken AI',
    searchPlaceholder: 'Nemo tabbaci...',
    allCategories: 'Duk Kayan Aiki',
    invention: 'Sabbin Kirkire-kirkire',
    discovery: 'Gano',
    research: 'Bincike',
    patent: 'Takardun Shaida na Hukuma',
    brand: 'Alamu',
    logo: 'Tambari',
    trademark: 'Alamar Kasuwanci',
    idea: 'Ra\'ayoyi',
    other: 'Sauran',
    allStatus: 'Duk Matsayi',
    aiApproved: '✅ AI Ya Amince',
    pendingAiReview: '⏳ Jira Bincike',
    notApproved: '❌ Ba A Amince Ba',
    clearFilters: 'Share Tacewa',
    noResultsTitle: 'Ba a Samu Tabbacin Jama\'a ba',
    noResultsDesc: 'Dawo anjima don ganin sabbin abubuwa daga al\'umma.',
    clearAllFilters: 'Share Duk Tacewa',
    loadingInnovations: 'Ana ɗora sabbin abubuwa...',
    sortBy: 'Tsara ta:',
    newest: 'Sabuwar',
    oldest: 'Tsohuwar',
    mostViewed: 'Mafi Yawan Kallo',
    categoryFilter: 'Rukuni:',
    viewDetails: 'Duba Cikakkun Bayanai',
  },
  yo: {
    title: "Àwòrán Àwọn Ẹ̀rí Gbangba",
    subtitle: "Ṣàwárí àwọn ẹ̀rí àìlẹ́gbẹ́ tí a fọwọ́sí láti ọ̀dọ̀ àwọn onipilẹṣẹ káríayé.",
    totalProofs: 'Apapọ Awọn Ẹrí',
    investmentReady: 'AI Ti Fọwọsí',
    pendingReview: 'Nduro fun Ayẹwo AI',
    searchPlaceholder: 'Wa nipasẹ akọle tabi adirẹsi...',
    allCategories: "Gbogbo Ẹ̀ka",
    invention: 'Awọn Ẹda Tuntun',
    discovery: 'Awọn Iwari',
    research: 'Iwadi',
    patent: 'Awọn Iwe-ẹri Ijoba',
    brand: 'Awọn Ami',
    logo: 'Awọn Logo',
    trademark: 'Awọn Ami-iṣowo',
    idea: 'Awọn Ero',
    other: 'Omiiran',
    allStatus: 'Gbogbo Ipo',
    aiApproved: '✅ AI Ti Fọwọsí',
    pendingAiReview: '⏳ Nduro fun Ayẹwo',
    notApproved: '❌ Ko Fọwọsí',
    clearFilters: 'Pa Awọn Ayẹwo Kúrò',
    noResultsTitle: "Kò sí àwọn ẹ̀rí gbangba tí a rí",
    noResultsDesc: "Gbìyànjú láti ṣàtúnṣe àwọn àṣàyàn rẹ tàbí padà wá nígbà tó yá.",
    clearAllFilters: 'Pa Gbogbo Awọn Ayẹwo Kúrò',
    loadingInnovations: 'N gbejade...',
    sortBy: "Tò Liana:",
    newest: "Tuntun Jùlọ",
    oldest: "Àtijọ́ Jùlọ",
    mostViewed: 'Ti Wo Julọ',
    categoryFilter: "Àyẹ̀wò Ẹ̀ka:",
    viewDetails: 'Wo Àwọn Àlàyé',
  },
  tr: {
    title: 'Galeri',
    subtitle: 'Topluluğun en son yeniliklerini keşfedin',
    totalProofs: 'Toplam Kanıt',
    investmentReady: 'AI Onaylı',
    pendingReview: 'AI İncelemesi Bekleniyor',
    searchPlaceholder: 'Başlığa veya adrese göre ara...',
    allCategories: 'Tüm Kategoriler',
    invention: 'Yeni Buluşlar',
    discovery: 'Keşifler',
    research: 'Araştırma',
    patent: 'Resmi Patentler',
    brand: 'Markalar',
    logo: 'Logolar',
    trademark: 'Ticari Markalar',
    idea: 'Fikirler',
    document: 'Belge',
    other: 'Diğer',
    allStatus: 'Tüm Durumlar',
    aiApproved: '✅ AI Onaylı',
    pendingAiReview: '⏳ İnceleme Bekleniyor',
    notApproved: '❌ Onaylanmadı',
    clearFilters: 'Filtreleri Temizle',
    noResultsTitle: 'Herkese Açık Kanıt Bulunamadı',
    noResultsDesc: 'Topluluktan yeni yenilikleri görmek için daha sonra tekrar kontrol edin.',
    clearAllFilters: 'Tüm Filtreleri Temizle',
    loadingInnovations: 'Yenilikler yükleniyor...',
    sortBy: 'Sırala:',
    newest: 'En Yeni',
    oldest: 'En Eski',
    mostViewed: 'En Çok Görüntülenen',
    categoryFilter: 'Kategori:',
    viewDetails: 'Detayları Görüntüle',
  },
  ku: {
    title: 'Galerîya Delîlan',
    subtitle: 'Fikr û dahênanên ku bi gelemperî hatine tomarkirin ji çar aliyên cîhanê vekolînin.',
    totalProofs: 'Tevahiya Delîlan',
    investmentReady: 'Ji aliyê AI ve hatiye pejirandin',
    pendingReview: 'Li benda nirxandina AI',
    searchPlaceholder: 'Li delîlan bigerin...',
    allCategories: 'Hemî Kategorî',
    invention: 'Dahênanên Nû',
    discovery: 'Vedîtin',
    research: 'Lêkolîn',
    patent: 'Patentên Fermî',
    brand: 'Marka',
    logo: 'Logo',
    trademark: 'Nîşanên Bazirganî',
    idea: 'Fikr',
    other: 'Din',
    allStatus: 'Hemî Rewş',
    aiApproved: '✅ Ji aliyê AI ve hatiye pejirandin',
    pendingAiReview: '⏳ Li benda nirxandinê',
    notApproved: '❌ Nehatiye pejirandin',
    clearFilters: 'Fîlteran Paqij Bike',
    noResultsTitle: 'Delîlên Giştî Nehatin Dîtin',
    noResultsDesc: 'Ji bo dîtina nûjeniyên nû ji civakê paşê dîsa kontrol bikin.',
    clearAllFilters: 'Hemî Fîlteran Paqij Bike',
    loadingInnovations: 'Nûjenî têne barkirin...',
    sortBy: 'Li gorî rêz bike:',
    newest: 'Nûtirîn',
    oldest: 'Kevntirîn',
    mostViewed: 'Herî Zêde Hatine Dîtin',
    categoryFilter: 'Kategorî:',
    viewDetails: 'Hûragahiyan Bibînin',
  },
  ps: {
    title: 'د ثبوتونو ګالري',
    subtitle: 'د نړۍ له ګوټ ګوټ څخه په عامه توګه ثبت شوي نظریات او اختراعات وپلټئ.',
    totalProofs: 'ټول ثبوتونه',
    investmentReady: 'د AI لخوا تصویب شوي',
    pendingReview: 'د AI بیاکتنې ته انتظار',
    searchPlaceholder: 'ثبوتونه وپلټئ...',
    allCategories: 'ټول کټګورۍ',
    invention: 'نوي اختراعات',
    discovery: 'کشفونه',
    research: 'څیړنه',
    patent: 'رسمي پیټینټونه',
    brand: 'برانډونه',
    logo: 'لوګو',
    trademark: 'سوداګریزې نښې',
    idea: 'نظریات',
    other: 'نور',
    allStatus: 'ټول حالتونه',
    aiApproved: '✅ د AI لخوا تصویب شوي',
    pendingAiReview: '⏳ د بیاکتنې په تمه',
    notApproved: '❌ تصویب شوي ندي',
    clearFilters: 'فلټرونه پاک کړئ',
    noResultsTitle: 'کوم عامه ثبوتونه ونه موندل شول',
    noResultsDesc: 'د ټولنې څخه د نویو نوښتونو لیدو لپاره وروسته بیا وګورئ.',
    clearAllFilters: 'ټول فلټرونه پاک کړئ',
    loadingInnovations: 'نوښتونه پورته کیږي...',
    sortBy: 'ترتیب کړئ د:',
    newest: 'نوی',
    oldest: 'ز-وړ',
    mostViewed: 'خورا لیدل شوي',
    categoryFilter: 'کټګوري:',
    viewDetails: 'جزیات وګورئ',
  }
};

export default function Gallery() {
  const [proofs, setProofs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: '',
    sortBy: 'newest',
    category: 'all',
    validation: 'all'
  });
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
  const [statsData, setStatsData] = useState({
    total: 0,
    approved: 0,
    pending: 0
  });

  const t = translations[language] || translations.en;

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('lang') || 'en');
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    const loadProofs = async () => {
      setIsLoading(true);
      try {
        const data = await Proof.filter({ is_public: true }, "-created_date");
        const safeData = Array.isArray(data) ? data : [];
        setProofs(safeData);

        const stats = {
          total: safeData.length,
          approved: safeData.filter(p => p && p.validation_status === 'ai_approved').length,
          pending: safeData.filter(p => p && p.validation_status === 'pending_ai_review').length
        };
        setStatsData(stats);
      } catch (error) {
        console.error("Error loading proofs:", error);
        setProofs([]);
        setStatsData({ total: 0, approved: 0, pending: 0 });
      }
      setIsLoading(false);
    };

    loadProofs();
  }, []);

  const getFilteredProofs = useMemo(() => {
    const safeProofs = Array.isArray(proofs) ? proofs : [];
    let currentFiltered = [...safeProofs];

    if (filters.query) {
      currentFiltered = currentFiltered.filter(proof =>
        proof && (
          (proof.title && proof.title.toLowerCase().includes(filters.query.toLowerCase())) ||
          (proof.description && proof.description.toLowerCase().includes(filters.query.toLowerCase())) ||
          (proof.tags && Array.isArray(proof.tags) && proof.tags.some(tag => tag && tag.toLowerCase().includes(filters.query.toLowerCase())))
        )
      );
    }

    if (filters.category !== "all") {
      currentFiltered = currentFiltered.filter(proof => proof && proof.category === filters.category);
    }

    if (filters.validation !== "all") {
      currentFiltered = currentFiltered.filter(proof => proof && proof.validation_status === filters.validation);
    }

    currentFiltered.sort((a, b) => {
      const dateA = new Date(a.created_date);
      const dateB = new Date(b.created_date);
      if (filters.sortBy === "newest") {
        return dateB.getTime() - dateA.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });

    return currentFiltered;
  }, [filters.query, filters.category, filters.validation, proofs, filters.sortBy]);

  const handleVisibilityChange = (updatedProof) => {
    const safeProofs = Array.isArray(proofs) ? proofs : [];
    setProofs(safeProofs.map(p => p && p.id === updatedProof.id ? updatedProof : p));
  };

  const safeFilteredProofs = Array.isArray(getFilteredProofs) ? getFilteredProofs : [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#2F80FF] animate-spin mr-3" />
          <span className="text-white">{t.loadingInnovations}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12" dir={['fa', 'ar', 'ur', 'ps', 'ku', 'bal'].includes(language) ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {t.title}
        </h1>
        <p className="text-gray-300 text-lg">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glow-card p-6 text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{statsData.total}</h3>
          <p className="text-gray-300">{t.totalProofs}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glow-card p-6 text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Users className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{statsData.approved}</h3>
          <p className="text-gray-300">{t.investmentReady}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glow-card p-6 text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{statsData.pending}</h3>
          <p className="text-gray-300">{t.pendingReview}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glow-card p-6 rounded-2xl mb-8"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="pl-10 bg-[#0B1220] border-gray-600 text-white placeholder:text-gray-400 focus:border-[#2F80FF] focus:ring-[#2F80FF]"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[180px]">
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-[#0B1220] border-gray-600 text-white focus:border-[#2F80FF] focus:ring-[#2F80FF]">
                  <SelectValue placeholder={t.allCategories} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2332] border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">{t.allCategories}</SelectItem>
                  <SelectItem value="patent" className="text-white hover:bg-gray-700">📜 {t.patent}</SelectItem>
                  <SelectItem value="discovery" className="text-white hover:bg-gray-700">🔬 {t.discovery}</SelectItem>
                  <SelectItem value="invention" className="text-white hover:bg-gray-700">⚙️ {t.invention}</SelectItem>
                  <SelectItem value="research" className="text-white hover:bg-gray-700">📊 {t.research}</SelectItem>
                  <SelectItem value="brand" className="text-white hover:bg-gray-700">🏷️ {t.brand}</SelectItem>
                  <SelectItem value="logo" className="text-white hover:bg-gray-700">🎨 {t.logo}</SelectItem>
                  <SelectItem value="trademark" className="text-white hover:bg-gray-700">™️ {t.trademark}</SelectItem>
                  <SelectItem value="idea" className="text-white hover:bg-gray-700">💡 {t.idea}</SelectItem>
                  <SelectItem value="design" className="text-white hover:bg-gray-700">📐 {t.design}</SelectItem>
                  <SelectItem value="document" className="text-white hover:bg-gray-700">📄 {t.document}</SelectItem>
                  <SelectItem value="other" className="text-white hover:bg-gray-700">🌐 {t.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[180px]">
              <Select value={filters.validation} onValueChange={(value) => setFilters(prev => ({ ...prev, validation: value }))}>
                <SelectTrigger className="bg-[#0B1220] border-gray-600 text-white focus:border-[#2F80FF] focus:ring-[#2F80FF]">
                  <SelectValue placeholder={t.allStatus} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2332] border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">{t.allStatus}</SelectItem>
                  <SelectItem value="ai_approved" className="text-white hover:bg-gray-700">{t.aiApproved}</SelectItem>
                  <SelectItem value="pending_ai_review" className="text-white hover:bg-gray-700">{t.pendingAiReview}</SelectItem>
                  <SelectItem value="ai_rejected" className="text-white hover:bg-gray-700">{t.notApproved}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[180px]">
              <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                <SelectTrigger className="bg-[#0B1220] border-gray-600 text-white focus:border-[#2F80FF] focus:ring-[#2F80FF]">
                  <SelectValue>
                    {t.sortBy} {filters.sortBy === "newest" ? t.newest : t.oldest}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2332] border-gray-600">
                  <SelectItem value="newest" className="text-white hover:bg-gray-700">{t.newest}</SelectItem>
                  <SelectItem value="oldest" className="text-white hover:bg-gray-700">{t.oldest}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => {
                setFilters({ query: '', sortBy: 'newest', category: 'all', validation: 'all' });
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white flex-shrink-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              {t.clearFilters}
            </Button>
          </div>
        </div>
      </motion.div>

      {safeFilteredProofs.length === 0 ? (
        <div className="text-center py-20">
          <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">{t.noResultsTitle}</h3>
          <p className="text-gray-400 mb-6">{t.noResultsDesc}</p>
          <Button
            onClick={() => {
              setFilters({ query: '', sortBy: 'newest', category: 'all', validation: 'all' });
            }}
            className="glow-button text-white"
          >
            {t.clearAllFilters}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {safeFilteredProofs.map((proof) => (
            proof && proof.id ? (
              <ProofCard
                key={proof.id}
                proof={proof}
                onVisibilityChange={handleVisibilityChange}
              />
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}
