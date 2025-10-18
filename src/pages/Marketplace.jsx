
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Proof } from '@/api/entities';
import { ProofTransfer } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  Coins,
  Award,
  ExternalLink,
  User as UserIcon,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Notification } from '@/api/entities';
import { base44 } from '@/api/base44Client';

const translations = {
  en: {
    title: "Intellectual Property Marketplace",
    subtitle: 'Discover, invest in, and trade unique intellectual properties.',
    searchPlaceholder: 'Search for proofs by title...',
    sortBy: 'Sort by:',
    newest: 'Newest',
    oldest: 'Oldest',
    priceHighLow: 'Price: High to Low',
    priceLowHigh: 'Price: Low to High',
    categoryFilter: 'Category:',
    allCategories: 'All Categories',
    buyNow: 'Buy Now',
    viewDetails: 'View Details',
    noResultsTitle: 'No proofs found for sale',
    noResultsDesc: 'Check back later or adjust your search filters.',
    proofsForSale: 'Proofs for Sale',
    available: 'Available',
    minPrice: 'Min Price (Cerebrum)',
    maxPrice: 'Max Price (Cerebrum)',
    avgPrice: 'Avg Price (Cerebrum)',
    ideas: 'Ideas',
    inventions: 'Inventions',
    brands: 'Brands',
    designs: 'Designs',
    other: 'Other',
    allPrices: 'All Prices',
    under10: 'Under 10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'Over 100 Cerebrum',
    popular: 'Most Popular',
    owner: 'Owner:',
    views: 'Views:',
    connectToBuy: 'Connect Wallet to Buy',
    ownProof: 'Your Own Proof',
    purchaseConfirm: 'Are you sure you want to purchase "{title}" for {price} Cerebrum tokens?',
    purchaseSuccess: '🎉 Purchase successful! The proof ownership has been transferred to you.',
    purchaseFailed: 'Purchase failed. Please try again.',
    purchaseOwnError: 'You cannot purchase your own proof.',
    insufficientBalance: 'Insufficient Cerebrum balance. You need {needed} Cerebrum but have {has} Cerebrum.',
    loading: 'Loading...',
    price: 'Price'
  },
  fa: {
    title: 'بازار نوآوری',
    subtitle: 'املاک معنوی منحصر به فرد را کشف، سرمایه‌گذاری و معامله کنید.',
    searchPlaceholder: 'جستجوی گواهی‌ها بر اساس عنوان...',
    sortBy: 'مرتب‌سازی بر اساس:',
    newest: 'جدیدترین',
    oldest: 'قدیمی‌ترین',
    priceHighLow: 'قیمت: زیاد به کم',
    priceLowHigh: 'قیمت: کم به زیاد',
    categoryFilter: 'دسته بندی:',
    allCategories: 'همه دسته بندی‌ها',
    buyNow: 'خرید فوری',
    viewDetails: 'مشاهده جزئیات',
    noResultsTitle: 'هیچ گواهی برای فروش یافت نشد',
    noResultsDesc: 'بعداً دوباره بررسی کنید یا فیلترهای جستجوی خود را تنظیم کنید.',
    proofsForSale: 'گواهی‌های برای فروش',
    available: 'موجود',
    minPrice: 'کمترین قیمت (Cerebrum)',
    maxPrice: 'بیشترین قیمت (Cerebrum)',
    avgPrice: 'میانگین قیمت (Cerebrum)',
    ideas: 'ایده‌ها',
    inventions: 'اختراعات',
    brands: 'برندها',
    designs: 'طراحی‌ها',
    other: 'سایر',
    allPrices: 'همه قیمت‌ها',
    under10: 'زیر ۱۰ Cerebrum',
    price10to50: '۱۰-۵۰ Cerebrum',
    price50to100: '۵۰-۱۰۰ Cerebrum',
    over100: 'بیش از ۱۰۰ Cerebrum',
    popular: 'محبوب‌ترین',
    owner: 'مالک:',
    views: 'بازدید:',
    connectToBuy: 'برای خرید، کیف پول را متصل کنید',
    ownProof: 'گواهی متعلق به شماست',
    purchaseConfirm: 'آیا مطمئن هستید که می‌خواهید "{title}" را به قیمت {price} توکن Cerebrum خریداری کنید؟',
    purchaseSuccess: '🎉 خرید موفق بود! مالکیت گواهی به شما منتقل شد.',
    purchaseFailed: 'خرید ناموفق بود. لطفاً دوباره تلاش کنید.',
    purchaseOwnError: 'شما نمی‌توانید گواهی خود را خریداری کنید.',
    insufficientBalance: 'موجودی Cerebrum کافی نیست. شما به {needed} توکن Cerebrum نیاز دارید اما {has} توکن دارید.',
    loading: 'در حال بارگیری...',
    price: 'قیمت'
  },
  zh: {
    title: '创新市场',
    subtitle: '发现、投资和交易独特的知识产权。',
    searchPlaceholder: '按标题搜索证明...',
    sortBy: '排序方式：',
    newest: '最新',
    oldest: '最旧',
    priceHighLow: '价格：从高到低',
    priceLowHigh: '价格：从低到高',
    categoryFilter: '类别：',
    allCategories: '所有类别',
    buyNow: '立即购买',
    viewDetails: '查看详情',
    noResultsTitle: '未找到待售证明',
    noResultsDesc: '请稍后再试或调整您的搜索过滤器。',
    proofsForSale: '待售证明',
    available: '可用',
    minPrice: '最低价 (Cerebrum)',
    maxPrice: '最高价 (Cerebrum)',
    avgPrice: '平均价 (Cerebrum)',
    ideas: '创意',
    inventions: '发明',
    brands: '品牌',
    designs: '设计',
    other: '其他',
    allPrices: '所有价格',
    under10: '低于10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: '超过100 Cerebrum',
    popular: '最受欢迎',
    owner: '所有者：',
    views: '浏览次数：',
    connectToBuy: '连接钱包以购买',
    ownProof: '您自己的证明',
    purchaseConfirm: '您确定要以{price} Cerebrum代币购买“{title}”吗？',
    purchaseSuccess: '🎉 购买成功！证明所有权已转移给您。',
    purchaseFailed: '购买失败。请重试。',
    purchaseOwnError: '您不能购买自己的证明。',
    insufficientBalance: 'Cerebrum余额不足。您需要{needed} Cerebrum，但只有{has} Cerebrum。',
    loading: '加载中...',
    price: '价格'
  },
  hi: {
    title: 'नवाचार बाज़ार',
    subtitle: 'अद्वितीय बौद्धिक संपदाओं की खोज करें, उनमें निवेश करें और उनका व्यापार करें।',
    searchPlaceholder: 'शीर्षक के अनुसार प्रमाण खोजें...',
    sortBy: 'क्रमबद्ध करें:',
    newest: 'नवीनतम',
    oldest: 'सबसे पुराना',
    priceHighLow: 'कीमत: उच्च से निम्न',
    priceLowHigh: 'कीमत: निम्न से उच्च',
    categoryFilter: 'श्रेणी:',
    allCategories: 'सभी श्रेणियाँ',
    buyNow: 'अभी खरीदें',
    viewDetails: 'विवरण देखें',
    noResultsTitle: 'बिक्री के लिए कोई प्रमाण नहीं मिला',
    noResultsDesc: 'बाद में फिर से देखें या अपने खोज फ़िल्टर समायोजित करें।',
    proofsForSale: 'बिक्री के लिए प्रमाण',
    available: 'उपलब्ध',
    minPrice: 'न्यूनतम कीमत (Cerebrum)',
    maxPrice: 'अधिकतम कीमत (Cerebrum)',
    avgPrice: 'औसत कीमत (Cerebrum)',
    ideas: 'विचार',
    inventions: 'आविष्कार',
    brands: 'ब्रांड',
    designs: 'डिज़ाइन',
    other: 'अन्य',
    allPrices: 'सभी कीमतें',
    under10: '10 सेरेब्रम से कम',
    price10to50: '10-50 सेरेब्रम',
    price50to100: '50-100 सेरेब्रम',
    over100: '100 सेरेब्रम से अधिक',
    popular: 'सबसे लोकप्रिय',
    owner: 'मालिक:',
    views: 'दृश्य:',
    connectToBuy: 'खरीदने के लिए वॉलेट कनेक्ट करें',
    ownProof: 'आपका अपना प्रमाण',
    purchaseConfirm: 'क्या आप वाकई {price} सेरेब्रम टोकन के लिए "{title}" खरीदना चाहते हैं?',
    purchaseSuccess: '🎉 खरीदारी सफल! प्रमाण का स्वामित्व आपको हस्तांतरित कर दिया गया है।',
    purchaseFailed: 'खरीदारी विफल। कृपया पुनः प्रयास करें।',
    purchaseOwnError: 'आप अपना खुद का प्रमाण नहीं खरीद सकते हैं।',
    insufficientBalance: 'मوجودی Cerebrum کافی نہیں ہے۔ آپ کو {needed} सेरेब्रम चाहिए लेकिन अप के पास {has} सेरेबरम है।',
    loading: 'लोड हो रहा है...',
    price: 'कीमत'
  },
  ur: {
    title: 'انوویشن مارکیٹ پلیس',
    subtitle: 'منفرد دانشورانہ املاک کو دریافت کریں، ان میں سرمایہ کاری کریں اور تجارت کریں۔',
    searchPlaceholder: 'عنوان کے لحاظ سے ثبوت تلاش کریں...',
    sortBy: 'ترتیب دیں:',
    newest: 'جدید ترین',
    oldest: 'قدیم ترین',
    priceHighLow: 'قیمت: زیادہ سے کم',
    priceLowHigh: 'قیمت: کم سے زیادہ',
    categoryFilter: 'زمرہ:',
    allCategories: 'تمام زمرے',
    buyNow: 'ابھی خریدیں',
    viewDetails: 'تفصیلات دیکھیں',
    noResultsTitle: 'فروخت کے لیے کوئی ثبوت نہیں ملا',
    noResultsDesc: 'بعد میں دوبارہ چیک کریں یا اپنے سرچ فلٹرز کو ایڈجسٹ کریں۔',
    proofsForSale: 'فروخت کے لیے ثبوت',
    available: 'دستیاب',
    minPrice: 'کم سے کم قیمت (Cerebrum)',
    maxPrice: 'زیادہ سے زیادہ قیمت (Cerebrum)',
    avgPrice: 'اوسط قیمت (Cerebrum)',
    ideas: 'خیالات',
    inventions: 'ایجادات',
    brands: 'برانڈز',
    designs: 'ڈیزائن',
    other: 'دیگر',
    allPrices: 'تمام قیمتیں',
    under10: '10 سیریب्रम سے کم',
    price10to50: '10-50 سیریب्रम',
    price50to100: '50-100 سیریب्रम',
    over100: '100 سیریب्रम سے زیادہ',
    popular: 'سب سے زیادہ مقبول',
    owner: 'مالک:',
    views: 'مناظر:',
    connectToBuy: 'خریدنے کے لیے والیٹ مربوط کریں',
    ownProof: 'آپ کا اپنا ثبوت',
    purchaseConfirm: 'کیا آپ واقعی {price} سیریب्रम ٹوکنز میں "{title}" خریدنا چاہتے ہیں؟',
    purchaseSuccess: '🎉 خریداری کامیاب! ثبوت کی ملکیت آپ کو منتقل کر دی گئی ہے۔',
    purchaseFailed: 'خریداری ناکام ہوگئی۔ براہ کرم دوبارہ کوشش کریں۔',
    purchaseOwnError: 'آپ اپنا ثبوت نہیں خرید سکتے ہیں۔',
    insufficientBalance: 'ناکافی سیریب्रम بیلنس۔ آپ کو {needed} سیریب्रम درکار ہیں لیکن آپ کے پاس {has} سیریب्रम ہیں۔',
    loading: 'لوڈ ہو رہا ہے...',
    price: 'قیمت'
  },
  de: {
    title: 'Marktplatz für Geistiges Eigentum',
    subtitle: 'Entdecken, erwerben und handeln Sie AI-validierte geistige Eigentumsrechte.',
    searchPlaceholder: 'Suche nach Titel, Kategorie oder Hash...',
    sortBy: 'Sortieren nach:',
    newest: 'Neueste',
    oldest: 'Älteste',
    priceHighLow: 'Preis: Hoch nach Niedrig',
    priceLowHigh: 'Preis: Niedrig nach Hoch',
    categoryFilter: 'Kategorie:',
    allCategories: 'Alle Kategorien',
    buyNow: 'Jetzt kaufen',
    viewDetails: 'Details anzeigen',
    noResultsTitle: 'Keine Nachweise gefunden',
    noResultsDesc: 'Versuchen Sie, Ihre Such- oder Filterkriterien anzupassen, um Ergebnisse zu finden.',
    proofsForSale: 'Nachweise zum Verkauf',
    available: 'Verfügbar',
    minPrice: 'Mindestpreis (Cerebrum)',
    maxPrice: 'Höchstpreis (Cerebrum)',
    avgPrice: 'Durchschnittspreis (Cerebrum)',
    ideas: 'Ideen',
    inventions: 'Erfindungen',
    brands: 'Marken',
    designs: 'Designs',
    other: 'Andere',
    allPrices: 'Alle Preise',
    under10: 'Unter 10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'Über 100 Cerebrum',
    popular: 'Beliebteste',
    owner: 'Eigentümer:',
    views: 'Aufrufe:',
    connectToBuy: 'Wallet verbinden zum Kaufen',
    ownProof: 'Ihr eigener Nachweis',
    purchaseConfirm: 'Sind Sie sicher, dass Sie "{title}" für {price} Cerebrum-Token kaufen möchten?',
    purchaseSuccess: '🎉 Kauf erfolgreich! Das Eigentum am Nachweis wurde auf Sie übertragen.',
    purchaseFailed: 'Kauf fehlgeschlagen. Bitte versuchen Sie es erneut.',
    purchaseOwnError: 'Sie können Ihren eigenen Nachweis nicht kaufen.',
    insufficientBalance: 'Unzureichendes Cerebrum-Guthaben. Sie benötigen {needed} Cerebrum, haben aber {has} Cerebrum.',
    loading: 'Lade Marktplatz...',
    invention: 'Erfindung',
    brand: 'Marke',
    idea: 'Idee',
    design: 'Design',
    price: 'Preis'
  },
  fr: {
    title: 'Marché de l\'innovation',
    subtitle: 'Découvrez, investissez et échangez des propriétés intellectuelles uniques.',
    searchPlaceholder: 'Rechercher des preuves par titre...',
    sortBy: 'Trier par :',
    newest: 'Plus récent',
    oldest: 'Plus ancien',
    priceHighLow: 'Prix : décroissant',
    priceLowHigh: 'Prix : croissant',
    categoryFilter: 'Catégorie :',
    allCategories: 'Toutes les catégories',
    buyNow: 'Acheter maintenant',
    viewDetails: 'Voir les détails',
    noResultsTitle: 'Aucune preuve à vendre trouvée',
    noResultsDesc: 'Revenez plus tard ou ajustez vos filtres de recherche.',
    proofsForSale: 'Preuves à vendre',
    available: 'Disponible',
    minPrice: 'Prix min (Cerebrum)',
    maxPrice: 'Prix max (Cerebrum)',
    avgPrice: 'Prix moyen (Cerebrum)',
    ideas: 'Idées',
    inventions: 'Inventions',
    brands: 'Marques',
    designs: 'Dessins',
    other: 'Autre',
    allPrices: 'Toutes les prix',
    under10: 'Moins de 10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'Plus de 100 Cerebrum',
    popular: 'Les plus populaires',
    owner: 'Propriétaire :',
    views: 'Vues :',
    connectToBuy: 'Connecter le portefeuille pour acheter',
    ownProof: 'Votre propre preuve',
    purchaseConfirm: 'Êtes-vous sûr de vouloir acheter "{title}" pour {price} jetons Cerebrum ?',
    purchaseSuccess: '🎉 Achat réussi ! La propriété de la preuve vous a été transférée.',
    purchaseFailed: 'Échec de l\'achat. Veuillez réessayer.',
    purchaseOwnError: 'Vous ne pouvez pas acheter votre propre preuve.',
    insufficientBalance: 'Solde Cerebrum insuffisant. Vous avez besoin de {needed} Cerebrum mais vous avez {has} Cerebrum.',
    loading: 'Chargement...',
    price: 'Prix'
  },
  es: {
    title: 'Mercado de la Innovación',
    subtitle: 'Descubra, invierta y comercie con propiedades intelectuales únicas.',
    searchPlaceholder: 'Buscar pruebas por título...',
    sortBy: 'Ordenar por:',
    newest: 'Más reciente',
    oldest: 'Más antiguo',
    priceHighLow: 'Precio: de mayor a menor',
    priceLowHigh: 'Precio: de menor a mayor',
    categoryFilter: 'Categoría:',
    allCategories: 'Todas las categorías',
    buyNow: 'Comprar ahora',
    viewDetails: 'Ver detalles',
    noResultsTitle: 'No se encontraron pruebas en venta',
    noResultsDesc: 'Vuelva más tarde o ajuste sus filtros de búsqueda.',
    proofsForSale: 'Pruebas en venta',
    available: 'Disponible',
    minPrice: 'Precio mín. (Cerebrum)',
    maxPrice: 'Precio máx. (Cerebrum)',
    avgPrice: 'Precio prom. (Cerebrum)',
    ideas: 'Ideas',
    inventions: 'Invenciones',
    brands: 'Marcas',
    designs: 'Diseños',
    other: 'Otro',
    allPrices: 'Todos los precios',
    under10: 'Menos de 10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'Más de 100 Cerebrum',
    popular: 'Más popular',
    owner: 'Propietario:',
    views: 'Vistas:',
    connectToBuy: 'Conectar billetera para comprar',
    ownProof: 'Tu propia prueba',
    purchaseConfirm: '¿Estás seguro de que quieres comprar "{title}" por {price} tokens de Cerebrum?',
    purchaseSuccess: '🎉 ¡Compra exitosa! La propiedad de la prueba ha sido transferida a ti.',
    purchaseFailed: 'La compra falló. Por favor, inténtalo de nuevo.',
    purchaseOwnError: 'No puedes comprar tu propia prueba.',
    insufficientBalance: 'Saldo de Cerebrum insuficiente. Necesitas {needed} Cerebrum pero tienes {has} Cerebrum.',
    loading: 'Cargando...',
    price: 'Precio'
  },
  ar: {
    title: 'سوق الابتكار',
    subtitle: 'اكتشف واستثمر وتداول في الملكيات الفكرية الفريدة.',
    searchPlaceholder: 'ابحث عن الإثباتات حسب العنوان...',
    sortBy: 'فرز حسب:',
    newest: 'الأحدث',
    oldest: 'الأقدم',
    priceHighLow: 'السعر: من الأعلى إلى الأقل',
    priceLowHigh: 'السعر: من الأقل إلى الأعلى',
    categoryFilter: 'الفئة:',
    allCategories: 'كل الفئات',
    buyNow: 'شراء الآن',
    viewDetails: 'عرض التفاصيل',
    noResultsTitle: 'لم يتم العثور على إثباتات للبيع',
    noResultsDesc: 'تحقق مرة أخرى لاحقًا أو اضبط مرشحات البحث.',
    proofsForSale: 'إثباتات للبيع',
    available: 'متاح',
    minPrice: 'أدنى سعر (Cerebrum)',
    maxPrice: 'أعلى سعر (Cerebrum)',
    avgPrice: 'متوسط السعر (Cerebrum)',
    ideas: 'أفكار',
    inventions: 'اختراعات',
    brands: 'علامات تجارية',
    designs: 'تصاميم',
    other: 'أخرى',
    allPrices: 'كل الأسعار',
    under10: 'أقل من 10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'أكثر من 100 Cerebrum',
    popular: 'الأكثر شهرة',
    owner: 'المالك:',
    views: 'المشاهدات:',
    connectToBuy: 'اتصل بالمحفظة للشراء',
    ownProof: 'إثباتك الخاص',
    purchaseConfirm: 'هل أنت متأكد أنك تريد شراء "{title}" مقابل {price} من رموز Cerebrum؟',
    purchaseSuccess: '🎉 تمت عملية الشراء بنجاح! تم نقل ملكية الإثبات إليك.',
    purchaseFailed: 'فشلت عملية الشراء. الرجاء معاودة المحاولة.',
    purchaseOwnError: 'لا يمكنك شراء إثباتك الخاص.',
    insufficientBalance: 'رصيد Cerebrum غير كافٍ. تحتاج إلى {needed} Cerebrum ولكن لديك {has} Cerebrum.',
    loading: 'جاري التحميل...',
    price: 'السعر'
  },
  ru: {
    title: 'Рынок инноваций',
    subtitle: 'Открывайте, инвестируйте и торгуйте уникальными объектами интеллектуальной собственности.',
    searchPlaceholder: 'Поиск доказательств по названию...',
    sortBy: 'Сортировать по:',
    newest: 'Самые новые',
    oldest: 'Самые старые',
    priceHighLow: 'Цена: от высокой к низкой',
    priceLowHigh: 'Цена: от низкой к высокой',
    categoryFilter: 'Категория:',
    allCategories: 'Все категории',
    buyNow: 'Купить сейчас',
    viewDetails: 'Посмотреть детали',
    noResultsTitle: 'Доказательства для продажи не найдены',
    noResultsDesc: 'Зайдите позже или измените фильтры поиска.',
    proofsForSale: 'Доказательства на продажу',
    available: 'Доступно',
    minPrice: 'Мин. цена (Cerebrum)',
    maxPrice: 'Макс. цена (Cerebrum)',
    avgPrice: 'Сред. цена (Cerebrum)',
    ideas: 'Идеи',
    inventions: 'Изобретения',
    brands: 'Бренды',
    designs: 'Дизайны',
    other: 'Другое',
    allPrices: 'Все цены',
    under10: 'Менее 10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'Более 100 Cerebrum',
    popular: 'Самые популярные',
    owner: 'Владелец:',
    views: 'Просмотры:',
    connectToBuy: 'Подключите кошелек для покупки',
    ownProof: 'Ваше собственное доказательство',
    purchaseConfirm: 'Вы уверены, что хотите купить "{title}" за {price} токенов Cerebrum?',
    purchaseSuccess: '🎉 Покупка прошла успешно! Право собственности на доказательство передано вам.',
    purchaseFailed: 'Покупка не удалась. Пожалуйста, попробуйте еще раз.',
    purchaseOwnError: 'Вы не можете купить собственное доказательство.',
    insufficientBalance: 'Недостаточно средств Cerebrum. Вам нужно {needed} Cerebrum, но у вас есть {has} Cerebrum.',
    loading: 'Загрузка...',
    price: 'Цена'
  },
  ja: {
    title: 'イノベーションマーケットプレイス',
    subtitle: 'ユニークな知的財産を発見、投資、取引します。',
    searchPlaceholder: 'タイトルで証明を検索...',
    sortBy: '並べ替え:',
    newest: '最新',
    oldest: '最古',
    priceHighLow: '価格: 高い順',
    priceLowHigh: '価格: 安い順',
    categoryFilter: 'カテゴリー:',
    allCategories: 'すべてのカテゴリー',
    buyNow: '今すぐ購入',
    viewDetails: '詳細を見る',
    noResultsTitle: '販売中の証明が見つかりません',
    noResultsDesc: '後で再確認するか、検索フィルターを調整してください。',
    proofsForSale: '販売中の証明',
    available: '利用可能',
    minPrice: '最低価格 (Cerebrum)',
    maxPrice: '最高価格 (Cerebrum)',
    avgPrice: '平均価格 (Cerebrum)',
    ideas: 'アイデア',
    inventions: '発明',
    brands: 'ブランド',
    designs: 'デザイン',
    other: 'その他',
    allPrices: 'すべての価格',
    under10: '10 Cerebrum未満',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: '100 Cerebrum以上',
    popular: '人気',
    owner: '所有者:',
    views: '閲覧数:',
    connectToBuy: '購入するにはウォレットを接続',
    ownProof: 'あなた自身の証明',
    purchaseConfirm: '本当に{price} Cerebrumトークンで「{title}」を購入しますか？',
    purchaseSuccess: '🎉 購入成功！証明の所有権があなたに譲渡されました。',
    purchaseFailed: '購入に失敗しました。もう一度お試しください。',
    purchaseOwnError: 'あなた自身の証明は購入できません。',
    insufficientBalance: 'Cerebrumの残高が不足しています。{needed} Cerebrumが必要ですが、{has} Cerebrumしかありません。',
    loading: '読み込み中...',
    price: '価格'
  },
  ko: {
    title: '혁신 마켓플레이스',
    subtitle: '독특한 지적 재산을 발견, 투자 및 거래하십시오.',
    searchPlaceholder: '제목으로 증명 검색...',
    sortBy: '정렬 기준:',
    newest: '최신순',
    oldest: '오래된순',
    priceHighLow: '가격: 높은 순',
    priceLowHigh: '가격: 낮은 순',
    categoryFilter: '카테고리:',
    allCategories: '모든 카테고리',
    buyNow: '지금 구매',
    viewDetails: '세부 정보 보기',
    noResultsTitle: '판매 중인 증명을 찾을 수 없습니다',
    noResultsDesc: '나중에 다시 확인하거나 검색 필터를 조정하십시오.',
    proofsForSale: '판매 중인 증명',
    available: '사용 가능',
    minPrice: '최저가 (Cerebrum)',
    maxPrice: '최고가 (Cerebrum)',
    avgPrice: '평균가 (Cerebrum)',
    ideas: '아이디어',
    inventions: '발명품',
    brands: '브랜드',
    designs: '디자인',
    other: '기타',
    allPrices: '모든 가격',
    under10: '10 Cerebrum 미만',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: '100 Cerebrum 이상',
    popular: '인기순',
    owner: '소유자:',
    views: '조회수:',
    connectToBuy: '구매하려면 지갑 연결',
    ownProof: '자신의 증명',
    purchaseConfirm: '정말로 {price} Cerebrum 토큰으로 "{title}"을(를) 구매하시겠습니까?',
    purchaseSuccess: '🎉 구매 성공! 증명 소유권이 귀하에게 이전되었습니다.',
    purchaseFailed: '구매에 실패했습니다. 다시 시도하십시오.',
    purchaseOwnError: '자신의 증명은 구매할 수 없습니다.',
    insufficientBalance: 'Cerebrum 잔액이 부족합니다. {needed} Cerebrum이 필요하지만 {has} Cerebrum만 있습니다.',
    loading: '로드 중...',
    price: '가격'
  },
  sw: {
    title: 'Soko la Ubunifu',
    subtitle: 'Gundua, wekeza, na fanya biashara ya mali miliki za kipekee.',
    searchPlaceholder: 'Tafuta ithibati kwa jina...',
    sortBy: 'Panga kwa:',
    newest: 'Mpya zaidi',
    oldest: 'Ya zamani zaidi',
    priceHighLow: 'Bei: Juu kwenda Chini',
    priceLowHigh: 'Bei: Chini kwenda Juu',
    categoryFilter: 'Kategoria:',
    allCategories: 'Kategoria Zote',
    buyNow: 'Nunua Sasa',
    viewDetails: 'Tazama Maelezo',
    noResultsTitle: 'Hakuna ithibati zinazouzwa zilizopatikana',
    noResultsDesc: 'Angalia tena baadaye au rekebisha vichujio vyako vya utafutaji.',
    proofsForSale: 'Ithibati Zinazouzwa',
    available: 'Inapatikana',
    minPrice: 'Bei ya Chini (Cerebrum)',
    maxPrice: 'Bei ya Juu (Cerebrum)',
    avgPrice: 'Bei ya Wastani (Cerebrum)',
    ideas: 'Mawazo',
    inventions: 'Uvumbuzi',
    brands: 'Chapa',
    designs: 'Miundo',
    other: 'Nyingine',
    allPrices: 'Bei Zote',
    under10: 'Chini ya 10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'Zaidi ya 100 Cerebrum',
    popular: 'Maarufu Zaidi',
    owner: 'Mmiliki:',
    views: 'Maoni:',
    connectToBuy: 'Unganisha Pochi ili Ununue',
    ownProof: 'Uthibitisho Wako Mwenyewe',
    purchaseConfirm: 'Una uhakika unataka kununua "{title}" kwa tokeni {price} za Cerebrum?',
    purchaseSuccess: '🎉 Ununuzi umefaulu! Umiliki wa ithibati umehamishiwa kwako.',
    purchaseFailed: 'Ununuzi haukufaulu. Tafadhali jaribu tena.',
    purchaseOwnError: 'Huwezi kununua ithibati yako mwenyewe.',
    insufficientBalance: 'Salio la Cerebrum halitoshi. Unahitaji {needed} Cerebrum lakini una {has} Cerebrum.',
    loading: 'Inapakia...',
    price: 'Bei'
  },
  ha: {
    title: 'Kasuwar Ƙirƙira',
    subtitle: 'Gano, saka hannun jari, da kasuwancin kadarorin hankali na musamman.',
    searchPlaceholder: 'Bincika tabbaci ta take...',
    sortBy: 'Shirya ta:',
    newest: 'Sabon shiga',
    oldest: 'Mafi tsufa',
    priceHighLow: 'Farashi: Daga sama zuwa kasa',
    priceLowHigh: 'Farashi: Daga kasa zuwa sama',
    categoryFilter: 'Rukuni:',
    allCategories: 'Duk Rukunnai',
    buyNow: 'Sayi Yanzu',
    viewDetails: 'Duba Cikakken Bayani',
    noResultsTitle: 'Ba a sami wani tabbaci na siyarwa ba',
    noResultsDesc: 'Duba baya an jima ko daidaita matattarar bincikenka.',
    proofsForSale: 'Tabbaci na Siyarwa',
    available: 'Akwai',
    minPrice: 'Mafi ƙarancin Farashi (Cerebrum)',
    maxPrice: 'Mafi girman Farashi (Cerebrum)',
    avgPrice: 'Matsakaicin Farashi (Cerebrum)',
    ideas: 'Ra\'ayoyi',
    inventions: 'Ƙirƙire-ƙirƙire',
    brands: 'Alamomi',
    designs: 'Zane-zane',
    other: 'Sauran',
    allPrices: 'Duk Farashi',
    under10: 'Kasa da 10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'Sama da 100 Cerebrum',
    popular: 'Mafi Shahara',
    owner: 'Mai shi:',
    views: 'Kallo:',
    connectToBuy: 'Haɗa Walat don Sayen',
    ownProof: 'Tabbacinka',
    purchaseConfirm: 'Ka tabbata kana son siyan "{title}" akan {price} alamun Cerebrum?',
    purchaseSuccess: '🎉 Sayen ya yi nasara! An mika maka mallakar tabbacin.',
    purchaseFailed: 'Sayen ya ga za. Da fatan za a sake gwadawa.',
    purchaseOwnError: 'Ba za ka iya siyan tabbacinka ba.',
    insufficientBalance: 'Rashin isasshen ma\'aunin Cerebrum. Kuna buƙatar {needed} Cerebrum amma kuna da {has} Cerebrum.',
    loading: 'Ana lodawa...',
    price: 'Farashi'
  },
  yo: {
    title: 'Ibi-ọja Innovation',
    subtitle: 'Ṣawari, ṣe idoko-owo, ati ṣowo awọn ohun-ini ọgbọn alailẹgbẹ.',
    searchPlaceholder: 'Wa awọn ẹri nipasẹ akọle...',
    sortBy: 'Ṣeto nipasẹ:',
    newest: 'Titun julọ',
    oldest: 'Atijọ julọ',
    priceHighLow: 'Iye: Giga si Kekere',
    priceLowHigh: 'Iye: Kekere si Giga',
    categoryFilter: 'Ẹka:',
    allCategories: 'Gbogbo Awọn ẹka',
    buyNow: 'Ra Bayi',
    viewDetails: 'Wo Awọn alaye',
    noResultsTitle: 'Ko si awọn ẹri ti a rii fun tita',
    noResultsDesc: 'Ṣayẹwo pada nigbamii tabi ṣatunṣe awọn asẹ wiwa rẹ.',
    proofsForSale: 'Awọn ẹri fun Tita',
    available: 'Wa',
    minPrice: 'Iye to kere (Cerebrum)',
    maxPrice: 'Iye to pọ julọ (Cerebrum)',
    avgPrice: 'Iye apapọ (Cerebrum)',
    ideas: 'Awọn imọran',
    inventions: 'Awọn ẹda',
    brands: 'Awọn burandi',
    designs: 'Awọn apẹrẹ',
    other: 'Omiiran',
    allPrices: 'Gbogbo Awọn iye',
    under10: 'Labẹ 10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'Ju 100 Cerebrum',
    popular: 'Gbajumọ julọ',
    owner: 'Oni:',
    views: 'Awọn iwo:',
    connectToBuy: 'So Apamọwọ pọ lati Ra',
    ownProof: 'Ẹri Tirẹ',
    purchaseConfirm: 'Ṣe o da ọ loju pe o fẹ ra "{title}" fun awọn ami-ami {price} Cerebrum?',
    purchaseSuccess: '🎉 Rira ṣaṣeyọri! A ti gbe ohun-ini ẹri si ọdọ rẹ.',
    purchaseFailed: 'Rira kuna. Jọwọ gbiyanju lẹẹkansi.',
    purchaseOwnError: 'O ko le ra ẹri tirẹ.',
    insufficientBalance: 'Iwọntunwọnsi Cerebrum ko to. O nilo {needed} Cerebrum ṣugbọn o ni {has} Cerebrum.',
    loading: 'N gbejade...',
    price: 'Iye'
  },
  tr: {
    title: 'İnovasyon Pazaryeri',
    subtitle: 'Benzersiz fikri mülkleri keşfedin, yatırım yapın ve ticaretini yapın.',
    searchPlaceholder: 'Başlığa göre kanıt arayın...',
    sortBy: 'Sırala:',
    newest: 'En Yeni',
    oldest: 'En Eski',
    priceHighLow: 'Fiyat: Yüksekten Düşüğe',
    priceLowHigh: 'Fiyat: Düşükten Yükseğe',
    categoryFilter: 'Kategori:',
    allCategories: 'Tüm Kategoriler',
    buyNow: 'Şimdi Satın Al',
    viewDetails: 'Detayları Görüntüle',
    noResultsTitle: 'Satılık kanıt bulunamadı',
    noResultsDesc: 'Daha sonra tekrar kontrol edin veya arama filtrelerinizi ayarlayın.',
    proofsForSale: 'Satılık Kanıtlar',
    available: 'Mevcut',
    minPrice: 'Min Fiyat (Cerebrum)',
    maxPrice: 'Maks Fiyat (Cerebrum)',
    avgPrice: 'Ort Fiyat (Cerebrum)',
    ideas: 'Fikirler',
    inventions: 'Buluşlar',
    brands: 'Markalar',
    designs: 'Tasarımlar',
    other: 'Diğer',
    allPrices: 'Tüm Fiyatlar',
    under10: '10 Cerebrum Altı',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: '100 Cerebrum Üzeri',
    popular: 'En Popüler',
    owner: 'Sahip:',
    views: 'Görüntüleme:',
    connectToBuy: 'Satın Almak için Cüzdanı Bağlayın',
    ownProof: 'Kendi Kanıtınız',
    purchaseConfirm: '"{title}" adlı kanıtı {price} Cerebrum jetonu karşılığında satın almak istediğinizden emin misiniz?',
    purchaseSuccess: '🎉 Satın alma başarılı! Kanıtın mülkiyeti size devredildi.',
    purchaseFailed: 'Satın alma başarısız oldu. Lütfen tekrar deneyin.',
    purchaseOwnError: 'Kendi kanıtınızı satın alamazsınız.',
    insufficientBalance: 'Yetersiz Cerebrum bakiyesi. {needed} Cerebrum\'a ihtiyacınız var ama {has} Cerebrum\'unuz var.',
    loading: 'Yükleniyor...',
    price: 'Fiyat'
  },
  ku: {
    title: 'Sûka Nûjeniyê',
    subtitle: 'Taybetmendiyên rewşenbîrî yên bêhempa kifş bikin, veberhênanê bikin û bazirganiyê bikin.',
    searchPlaceholder: 'Li gorî sernavê li delîlan bigerin...',
    sortBy: 'Rêz bike li gorî:',
    newest: 'Nûtirîn',
    oldest: 'Kevntirîn',
    priceHighLow: 'Biha: Ji Bilind ber bi Nizim',
    priceLowHigh: 'Biha: Ji Nizim ber bi Bilind',
    categoryFilter: 'Kategorî:',
    allCategories: 'Hemû Kategorî',
    buyNow: 'Niha Bikire',
    viewDetails: 'Detayan Bibîne',
    noResultsTitle: 'Tu delîl ji bo firotinê nehatin dîtin',
    noResultsDesc: 'Paşê dîsa kontrol bikin an jî parzûnên lêgerîna xwe sererast bikin.',
    proofsForSale: 'Delîlên ji bo Firotinê',
    available: 'Berdest',
    minPrice: 'Bihayê Kêm (Cerebrum)',
    maxPrice: 'Bihayê Zêde (Cerebrum)',
    avgPrice: 'Bihayê Navîn (Cerebrum)',
    ideas: 'Fikir',
    inventions: 'Dahênan',
    brands: 'Marke',
    designs: 'Sêwiran',
    other: 'Yên din',
    allPrices: 'Hemû Biha',
    under10: 'Di bin 10 Cerebrum',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'Li ser 100 Cerebrum',
    popular: 'Herî Populer',
    owner: 'Xwedî:',
    views: 'Dîtin:',
    connectToBuy: 'Ji bo Kirînê Berîkê Girêde',
    ownProof: 'Delîla We',
    purchaseConfirm: 'Ma hûn bawer in ku hûn dixwazin "{title}" bi {price} nîşanekên Cerebrum bikirin?',
    purchaseSuccess: '🎉 Kirîn serketî bû! Xwedîtiya delîlê ji we re hate veguhestin.',
    purchaseFailed: 'Kirîn bi ser neket. Ji kerema xwe dîsa biceribînin.',
    purchaseOwnError: 'Hûn nikarin delîla xwe bikirin.',
    insufficientBalance: 'Bêyeteriya balansa Cerebrum. Pêdiviya we bi {needed} Cerebrum heye lê {has} Cerebrum we hene.',
    loading: 'Tê Barkirin...',
    price: 'Biha'
  },
  ps: {
    title: 'د نوښت بازار',
    subtitle: 'بې ساري فکري ملکیتونه کشف، پانګونه او تجارت وکړئ.',
    searchPlaceholder: 'د سرلیک له مخې ثبوتونه وپلټئ...',
    sortBy: 'ترتیب کړئ د:',
    newest: 'نوی',
    oldest: 'زوړ',
    priceHighLow: 'بیه: له لوړ څخه ټیټ ته',
    priceLowHigh: 'بیه: له ټیټ څخه لوړ ته',
    categoryFilter: 'کټګوري:',
    allCategories: 'ټولې کټګورۍ',
    buyNow: 'همدا اوس وپیرئ',
    viewDetails: 'جزئیات وګورئ',
    noResultsTitle: 'د پلور لپاره هیڅ ثبوت ونه موندل شو',
    noResultsDesc: 'وروسته بیا وګورئ یا خپل د لټون فلټرونه تنظیم کړئ.',
    proofsForSale: 'د پلور لپاره ثبوتونه',
    available: 'شتون لري',
    minPrice: 'لږ تر لږه بیه (Cerebrum)',
    maxPrice: 'ډیره بیه (Cerebrum)',
    avgPrice: 'اوسط بیه (Cerebrum)',
    ideas: 'نظرونه',
    inventions: 'اختراعات',
    brands: 'برانډونه',
    designs: 'ډیزاینونه',
    other: 'نور',
    allPrices: 'ټولې بیې',
    under10: 'له 10 Cerebrum څخه کم',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: 'له 100 Cerebrum څخه ډیر',
    popular: 'ډیر مشهور',
    owner: 'مالک:',
    views: 'لیدونه:',
    connectToBuy: 'د پیرلو لپاره والټ وصل کړئ',
    ownProof: 'ستاسو خپل ثبوت',
    purchaseConfirm: 'ایا تاسو ډاډه یاست چې "{title}" د {price} Cerebrum توکونو لپاره اخلئ؟',
    purchaseSuccess: '🎉 پیرود بریالی شو! د ثبوت ملکیت تاسو ته انتقال شو.',
    purchaseFailed: 'پیرود ناکام شو. مهرباني وکړئ بیا هڅه وکړئ.',
    purchaseOwnError: 'تاسو نشئ کولی خپل ثبوت وپیرئ.',
    insufficientBalance: 'د Cerebrum بیلانس ناکافي دی. تاسو {needed} Cerebrum ته اړتیا لرئ مګر تاسو {has} Cerebrum لرئ.',
    loading: 'لوډ کیږي...',
    price: 'بیه'
  },
  bal: {
    title: 'انٹلیکچوئل پراپرٹی مارکیٹ پلیس',
    subtitle: 'AI ءِ ذریعہ تصدیق بوتگیں انٹلیکچوئل پراپرٹی حقوق ءَ دریافت، حاصل ءُ تجارت کن ات.',
    searchPlaceholder: 'عنوان، دسته‌بندی، یا ہیش ءِ ذریعہ شوہاز کن...',
    sortBy: 'ترتیب دیگ ءِ اساس',
    newest: 'نوکترین',
    oldest: 'پیشیترین',
    priceHighLow: 'قیمت: گیشتر ءَ چہ کم ءَ',
    priceLowHigh: 'قیمت: کم ءَ چہ گیشتر ءَ',
    categoryFilter: 'دسته‌بندی',
    allCategories: 'کل دسته‌بندی',
    buyNow: 'هونئی ءَ بگیل',
    viewDetails: 'تصیلات ءِ دیستن',
    noResultsTitle: 'هچ گواهی در نہ کپت',
    noResultsDesc: 'وتی شوہاز یا فلٹر ءِ معیار ءَ بدل کنگ ءِ کوشش کن ات تاں نتیجہ در بکن ات.',
    proofsForSale: 'فروخت ءَ گواهی',
    available: 'دستیاب',
    minPrice: 'کمین قیمت (Cerebrum)',
    maxPrice: 'گیشین قیمت (Cerebrum)',
    avgPrice: 'میانی قیمت (Cerebrum)',
    ideas: 'فکر', // Assuming plural for ideas based on other translations, Balochi outline only had singular 'ایجاد' for 'invention'
    inventions: 'ایجادات', // Assuming plural for inventions
    brands: 'برانڈز', // Assuming plural for brands
    designs: 'دیزاین', // Assuming plural for designs
    other: 'دگہ',
    allPrices: 'کل قیمت',
    under10: '10 Cerebrum چہ کم',
    price10to50: '10-50 Cerebrum',
    price50to100: '50-100 Cerebrum',
    over100: '100 Cerebrum چہ گیش',
    popular: 'مشهورترین',
    owner: 'واجہ:',
    views: 'دیم پہ دیم:',
    connectToBuy: 'پہ گیلگ ءَ، والیٹ ءَ گنڈگ',
    ownProof: 'وتی گواهی',
    purchaseConfirm: 'آیا شما باور دارید که "{{title}}" به قیمت {price} Cerebrum توکن ءَ گیلگ وارت؟',
    purchaseSuccess: '🎉 گیلگ ءَ سوبمند! گواهی ءِ مالکیت شمئی ءَ منتقل بوتگ.',
    purchaseFailed: 'گیلگ ءَ سوبمند نہ بوت. لطفاً یک بار دگہ کوشست کن ات.',
    purchaseOwnError: 'شما وتی گواهی ءَ گیلگ کرت نہ کن ات.',
    insufficientBalance: 'Cerebrum ءِ بیلانس بس نہ انت. شمئی ءَ {needed} Cerebrum لوٹیت بلے {has} Cerebrum اِش است.',
    loading: 'بازار لوڈ کنگ ءَ اِنت...',
    invention: 'ایجاد',
    brand: 'برانڈ',
    idea: 'آئیڈیا',
    design: 'دیزاین',
    price: 'قیمت'
  }
};

export default function Marketplace() {
  const [proofs, setProofs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(null); 
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
  const isConnected = false; 
  const address = null; 

  const [filters, setFilters] = useState({
    query: '',
    sortBy: 'newest',
    category: 'all',
    priceRange: 'allPrices',
  });

  const [stats, setStats] = useState({
    available: 0,
    minPrice: 0,
    maxPrice: 0,
    avgPrice: 0,
  });

  const loadProofs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.Proof.filter({ is_for_sale: true, is_public: true }, "-created_date");
      setProofs(data || []);
    } catch (error) {
      console.error("Error loading proofs for sale:", error);
      setProofs([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProofs();
    
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('lang') || 'en');
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, [loadProofs]);

  const filteredProofs = useMemo(() => {
    let filtered = proofs.filter(p => p && p.is_for_sale);

    if (filters.query) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(filters.query.toLowerCase()));
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.priceRange !== 'allPrices') {
        const [min, max] = {
            'under10': [0, 9.99],
            'price10to50': [10, 50],
            'price50to100': [50, 100],
            'over100': [100.01, Infinity]
        }[filters.priceRange];
        filtered = filtered.filter(p => p.sale_price >= min && p.sale_price <= max);
    }
    
    switch(filters.sortBy) {
        case 'oldest':
            filtered.sort((a,b) => new Date(a.created_date) - new Date(b.created_date));
            break;
        case 'priceHighLow':
            filtered.sort((a,b) => (b.sale_price || 0) - (a.sale_price || 0));
            break;
        case 'priceLowHigh':
            filtered.sort((a,b) => (a.sale_price || 0) - (b.sale_price || 0));
            break;
        case 'newest':
        default:
            filtered.sort((a,b) => new Date(b.created_date) - new Date(a.created_date));
            break;
    }
    return filtered;
  }, [proofs, filters]);

  useEffect(() => {
    if (filteredProofs.length > 0) {
      const prices = filteredProofs.map(p => p.sale_price).filter(p => p > 0);
      if (prices.length > 0) {
        setStats({
          available: filteredProofs.length,
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
        });
      } else {
        setStats({ available: filteredProofs.length, minPrice: 0, maxPrice: 0, avgPrice: 0 });
      }
    } else {
      setStats({ available: 0, minPrice: 0, maxPrice: 0, avgPrice: 0 });
    }
  }, [filteredProofs]);

  const handlePurchase = async (proofToBuy) => {
    if (!isConnected || !address) {
      alert(t.connectToBuy);
      return;
    }
    if (proofToBuy.owner_wallet_address.toLowerCase() === address.toLowerCase()) {
      alert(t.purchaseOwnError);
      return;
    }

    if (!window.confirm(t.purchaseConfirm.replace('{title}', proofToBuy.title).replace('{price}', proofToBuy.sale_price))) {
      return;
    }

    setIsPurchasing(proofToBuy.id);
    try {
      const { data: purchaseResult } = await base44.functions.invoke('purchaseProof', {
        proofId: proofToBuy.id,
        buyerAddress: address
      });

      if (purchaseResult.success) {
        alert(t.purchaseSuccess);
        loadProofs(); // Refresh the marketplace
      } else {
        throw new Error(purchaseResult.error || t.purchaseFailed);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert(error.message);
    } finally {
      setIsPurchasing(null);
    }
  };

  const t = translations[language] || translations.en;
  const isRTL = ['fa', 'ar', 'ur', 'ps', 'bal'].includes(language);

  const StatCard = ({ icon, label, value, formatAsCurrency = true }) => (
    <div className="glow-card p-4 rounded-lg flex items-center gap-4">
      {icon}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-bold text-white">
          {formatAsCurrency ? `${Number(value).toFixed(2)}` : value}
          {formatAsCurrency && <span className="text-xs text-gray-400"> CBR</span>}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-gray-400">{t.subtitle}</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<ShoppingBag className="w-8 h-8 text-blue-400"/>} label={t.available} value={stats.available} formatAsCurrency={false} />
            <StatCard icon={<Coins className="w-8 h-8 text-yellow-400"/>} label={t.minPrice} value={stats.minPrice} />
            <StatCard icon={<TrendingUp className="w-8 h-8 text-green-400"/>} label={t.maxPrice} value={stats.maxPrice} />
            <StatCard icon={<DollarSign className="w-8 h-8 text-cyan-400"/>} label={t.avgPrice} value={stats.avgPrice} />
        </div>


        {/* Filters Section */}
        <div className="bg-gray-800/20 backdrop-blur-sm p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-1">
                <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={filters.query}
                    onChange={(e) => setFilters(prev => ({...prev, query: e.target.value}))}
                    className="bg-gray-900/50 border-gray-700 pl-10 w-full"
                />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({...prev, sortBy: value}))}>
                    <SelectTrigger className="w-full md:w-[180px] bg-gray-900/50 border-gray-700">
                        <SelectValue placeholder={t.sortBy} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">{t.newest}</SelectItem>
                        <SelectItem value="oldest">{t.oldest}</SelectItem>
                        <SelectItem value="priceHighLow">{t.priceHighLow}</SelectItem>
                        <SelectItem value="priceLowHigh">{t.priceLowHigh}</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({...prev, category: value}))}>
                    <SelectTrigger className="w-full md:w-[180px] bg-gray-900/50 border-gray-700">
                        <SelectValue placeholder={t.categoryFilter} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t.allCategories}</SelectItem>
                        <SelectItem value="invention">{t.invention}</SelectItem>
                        <SelectItem value="idea">{t.idea}</SelectItem>
                        <SelectItem value="brand">{t.brand}</SelectItem>
                        <SelectItem value="design">{t.design}</SelectItem>
                        <SelectItem value="other">{t.other}</SelectItem>
                    </SelectContent>
                </Select>

                 <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({...prev, priceRange: value}))}>
                    <SelectTrigger className="w-full md:w-[180px] bg-gray-900/50 border-gray-700">
                        <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="allPrices">{t.allPrices}</SelectItem>
                        <SelectItem value="under10">{t.under10}</SelectItem>
                        <SelectItem value="price10to50">{t.price10to50}</SelectItem>
                        <SelectItem value="price50to100">{t.price50to100}</SelectItem>
                        <SelectItem value="over100">{t.over100}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Proofs Grid */}
        <AnimatePresence>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : filteredProofs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProofs.map(proof => {
                const isOwner = isConnected && address && proof.owner_wallet_address.toLowerCase() === address.toLowerCase();
                return (
                  <motion.div
                    key={proof.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glow-card rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-white mb-2 pr-2">{proof.title}</h3>
                          <Badge variant="secondary" className="capitalize shrink-0">{t[proof.category] || proof.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{proof.description || 'No description available.'}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                          <UserIcon className="w-4 h-4 mr-2" />
                          <span className="truncate">{proof.owner_wallet_address}</span>
                      </div>
                    </div>
                    
                    <div className="p-5 border-t border-gray-700/50 mt-auto">
                      <div className="flex justify-between items-center mb-4">
                          <p className="text-gray-400 text-sm">{t.price}</p>
                          <p className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                              <Coins className="w-5 h-5"/>
                              {proof.sale_price}
                          </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            className="flex-1" 
                            onClick={() => handlePurchase(proof)}
                            disabled={!isConnected || isOwner || isPurchasing === proof.id}
                          >
                            {isPurchasing === proof.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <ShoppingCart className="w-4 h-4 mr-2"/>}
                            {isOwner ? t.ownProof : t.buyNow}
                          </Button>
                         <Link to={createPageUrl(`PublicProof?id=${proof.id}`)} className="flex-1">
                              <Button variant="outline" className="w-full" disabled={isPurchasing === proof.id}>
                                  {t.viewDetails}
                                  <ExternalLink className="w-4 h-4 ml-2"/>
                              </Button>
                          </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
              <h3 className="text-2xl font-semibold text-white mb-2">{t.noResultsTitle}</h3>
              <p className="text-gray-400">{t.noResultsDesc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
