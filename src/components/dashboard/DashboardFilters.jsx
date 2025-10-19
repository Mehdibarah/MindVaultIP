
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const translations = {
  en: {
    searchPlaceholder: 'Search my proofs...',
    allCategories: 'All Categories',
    idea: 'Idea',
    invention: 'Invention',
    brand: 'Brand',
    design: 'Design',
    document: 'Document',
    other: 'Other',
    sortBy: 'Sort By',
    newest: 'Newest First',
    oldest: 'Oldest First',
    titleAsc: 'Title (A-Z)',
    titleDesc: 'Title (Z-A)'
  },
  fa: {
    searchPlaceholder: 'جستجو در گواهی‌های من...',
    allCategories: 'همه دسته‌بندی‌ها',
    idea: 'ایده',
    invention: 'اختراع',
    brand: 'برند',
    design: 'طراحی',
    document: 'داکیومنت',
    other: 'سایر',
    sortBy: 'مرتب‌سازی بر اساس',
    newest: 'جدیدترین',
    oldest: 'قدیمی‌ترین',
    titleAsc: 'عنوان (الف-ی)',
    titleDesc: 'عنوان (ی-الف)'
  },
  ar: {
    searchPlaceholder: 'ابحث في إثباتاتي...',
    allCategories: 'جميع الفئات',
    idea: 'فكرة',
    invention: 'اختراع',
    brand: 'علامة تجارية',
    design: 'تصميم',
    document: 'وثيقة',
    other: 'أخرى',
    sortBy: 'فرز حسب',
    newest: 'الأحدث أولاً',
    oldest: 'الأقدم أولاً',
    titleAsc: 'العنوان (أ-ي)',
    titleDesc: 'العنوان (ي-أ)'
  },
  zh: {
    searchPlaceholder: '搜索我的证明...',
    allCategories: '所有类别',
    idea: '想法',
    invention: '发明',
    brand: '品牌',
    design: '设计',
    document: '文档',
    other: '其他',
    sortBy: '排序方式',
    newest: '最新优先',
    oldest: '最旧优先',
    titleAsc: '标题 (A-Z)',
    titleDesc: '标题 (Z-A)'
  },
  hi: {
    searchPlaceholder: 'मेरे प्रमाण खोजें...',
    allCategories: 'सभी श्रेणियाँ',
    idea: 'विचार',
    invention: 'आविष्कार',
    brand: 'ब्रांड',
    design: 'डिज़ाइन',
    document: 'दस्तावेज़',
    other: 'अन्य',
    sortBy: 'इसके अनुसार क्रमबद्ध करें',
    newest: 'नवीनतम पहले',
    oldest: 'सबसे पुराना पहले',
    titleAsc: 'शीर्षक (A-Z)',
    titleDesc: 'शीर्षक (Z-A)'
  },
  ur: {
    searchPlaceholder: 'میرے ثبوت تلاش کریں...',
    allCategories: 'تمام زمرے',
    idea: 'خیال',
    invention: 'ایجاد',
    brand: 'برانڈ',
    design: 'ڈیزائن',
    other: 'دیگر',
    sortBy: 'ترتیب دیں',
    newest: 'سب سے نیا پہلے',
    oldest: 'سب سے پرانا پہلے',
    titleAsc: 'عنوان (A-Z)',
    titleDesc: 'عنوان (Z-A)'
  },
  de: {
    searchPlaceholder: 'Meine Nachweise durchsuchen...',
    allCategories: 'Alle Kategorien',
    idea: 'Idee',
    invention: 'Erfindung',
    brand: 'Marke',
    design: 'Design',
    document: 'Dokument',
    other: 'Andere',
    sortBy: 'Sortieren nach',
    newest: 'Neueste zuerst',
    oldest: 'Älteste zuerst',
    titleAsc: 'Titel (A-Z)',
    titleDesc: 'Titel (Z-A)'
  },
  fr: {
    searchPlaceholder: 'Rechercher mes preuves...',
    allCategories: 'Toutes les catégories',
    idea: 'Idée',
    invention: 'Invention',
    brand: 'Marque',
    design: 'Autre',
    document: 'Document',
    other: 'Autre',
    sortBy: 'Trier par',
    newest: 'Le plus récent d\'abord',
    oldest: 'Le plus ancien d\'abord',
    titleAsc: 'Titre (A-Z)',
    titleDesc: 'Titre (Z-A)'
  },
  es: {
    searchPlaceholder: 'Buscar mis pruebas...',
    allCategories: 'Todas las categorías',
    idea: 'Idea',
    invention: 'Invención',
    brand: 'Marca',
    design: 'Diseño',
    document: 'Documento',
    other: 'Otro',
    sortBy: 'Ordenar por',
    newest: 'Más nuevos primero',
    oldest: 'Más antiguos primero',
    titleAsc: 'Título (A-Z)',
    titleDesc: 'Título (Z-A)'
  },
  ru: {
    searchPlaceholder: 'Искать мои доказательства...',
    allCategories: 'Все категории',
    idea: 'Идея',
    invention: 'Изобретение',
    brand: 'Бренд',
    design: 'Дизайн',
    document: 'Документ',
    other: 'Другое',
    sortBy: 'Сортировать по',
    newest: 'Сначала новые',
    oldest: 'Сначала старые',
    titleAsc: 'Название (А-Я)',
    titleDesc: 'Название (Я-А)'
  },
  ja: {
    searchPlaceholder: '私の証明を検索...',
    allCategories: 'すべてのカテゴリ',
    idea: 'アイデア',
    invention: '発明',
    brand: 'ブランド',
    design: 'デザイン',
    other: 'その他',
    sortBy: '並べ替え',
    newest: '新しい順',
    oldest: '古い順',
    titleAsc: 'タイトル (A-Z)',
    titleDesc: 'タイトル (Z-A)'
  },
  ko: {
    searchPlaceholder: '내 증명 검색...',
    allCategories: '모든 카테고리',
    idea: '아이디어',
    invention: '발명',
    brand: '브랜드',
    design: '디자인',
    other: '기타',
    sortBy: '정렬 기준',
    newest: '최신순',
    oldest: '오래된순',
    titleAsc: '제목 (A-Z)',
    titleDesc: '제목 (Z-A)'
  },
  sw: {
    searchPlaceholder: 'Tafuta ithibati zangu...',
    allCategories: 'Kategoria Zote',
    idea: 'Wazo',
    invention: 'Uvumbuzi',
    brand: 'Chapa',
    design: 'Usanifu',
    other: 'Nyingine',
    sortBy: 'Panga kwa',
    newest: 'Mpya Kwanza',
    oldest: 'Ya Zamani Kwanza',
    titleAsc: 'Kichwa (A-Z)',
    titleDesc: 'Kichwa (Z-A)'
  },
  ha: {
    searchPlaceholder: 'Bincika tabbaci na...',
    allCategories: 'Duk Rukunoni',
    idea: 'Ra\'ayi',
    invention: 'Ƙirƙira',
    brand: 'Alama',
    design: 'Zane',
    other: 'Sauran',
    sortBy: 'Shirya ta',
    newest: 'Sabon Farko',
    oldest: 'Tsohon Farko',
    titleAsc: 'Take (A-Z)',
    titleDesc: 'Take (Z-A)'
  },
  yo: {
    searchPlaceholder: 'Wa awọn ẹri mi...',
    allCategories: 'Gbogbo Awọn Ẹka',
    idea: 'Ero',
    invention: 'Ipilese',
    brand: 'Ami',
    design: 'Apẹrẹ',
    other: 'Omiiran',
    sortBy: 'To liana nipasẹ',
    newest: 'Titun Ni akọkọ',
    oldest: 'Eldest Ni akọkọ',
    titleAsc: 'Akọle (A-Z)',
    titleDesc: 'Akọle (Z-A)'
  },
  tr: {
    searchPlaceholder: 'Kanıtlarımı ara...',
    allCategories: 'Tüm Kategoriler',
    idea: 'Fikir',
    invention: 'Buluş',
    brand: 'Marka',
    design: 'Tasarım',
    document: 'Belge',
    other: 'Diğer',
    sortBy: 'Sırala',
    newest: 'Önce En Yeni',
    oldest: 'Önce En Eski',
    titleAsc: 'Başlık (A-Z)',
    titleDesc: 'Başlık (Z-A)'
  },
  ku: {
    searchPlaceholder: 'Li delîlên min bigere...',
    allCategories: 'Hemî Kategorî',
    idea: 'Fikir',
    invention: 'Dahênan',
    brand: 'Marka',
    design: 'Sêwirandin',
    other: 'Yên din',
    sortBy: 'Li gorî rêz bike',
    newest: 'Nûtirîn Pêşî',
    oldest: 'Kevntirîn Pêşî',
    titleAsc: 'Sernav (A-Z)',
    titleDesc: 'Sernav (Z-A)'
  },
  ps: {
    searchPlaceholder: 'زما ثبوتونه وپلټئ...',
    allCategories: 'ټول کټګورۍ',
    idea: 'نظر',
    invention: 'اختراع',
    brand: 'برانډ',
    design: 'ډیزاین',
    other: 'نور',
    sortBy: 'ترتیب کړئ د',
    newest: 'نوی لومړی',
    oldest: 'زوړ لومړی',
    titleAsc: 'سرلیک (A-Z)',
    titleDesc: 'سرلیک (Z-A)'
  },
  bal: {
    searchPlaceholder: 'منی گواهیانی تہ ءَ شوہاز کن...',
    allCategories: 'کل دسته‌بندی',
    idea: 'آئیڈیا',
    invention: 'ایجاد',
    brand: 'برانڈ',
    design: 'ڈیزائن',
    other: 'دگہ',
    sortBy: 'ترتیب دیگ ءِ اساس',
    newest: 'نوکترین اول',
    oldest: 'پیشیترین اول',
    titleAsc: 'عنوان (A-Z)',
    titleDesc: 'عنوان (Z-A)'
  }
};

export default function DashboardFilters({ filters, onFilterChange }) {
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

  const handleInputChange = (e) => {
    onFilterChange({ ...filters, query: e.target.value });
  };

  const handleCategoryChange = (value) => {
    onFilterChange({ ...filters, category: value });
  };
  
  const handleSortChange = (value) => {
    onFilterChange({ ...filters, sortBy: value });
  };

  const t = translations[language] || translations.en;

  return (
    <div className="glow-card p-4 rounded-2xl mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder={t.searchPlaceholder}
            value={filters.query}
            onChange={handleInputChange}
            className="pl-10 bg-[#0B1220] border-gray-600"
          />
        </div>
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="bg-[#0B1220] border-gray-600 text-white">
            <SelectValue placeholder={t.allCategories} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allCategories}</SelectItem>
            <SelectItem value="idea">{t.idea}</SelectItem>
            <SelectItem value="invention">{t.invention}</SelectItem>
            <SelectItem value="brand">{t.brand}</SelectItem>
            <SelectItem value="design">{t.design}</SelectItem>
            <SelectItem value="document">{t.document}</SelectItem>
            <SelectItem value="other">{t.other}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="bg-[#0B1220] border-gray-600 text-white">
            <SelectValue placeholder={t.sortBy} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t.newest}</SelectItem>
            <SelectItem value="oldest">{t.oldest}</SelectItem>
            <SelectItem value="title-asc">{t.titleAsc}</SelectItem>
            <SelectItem value="title-desc">{t.titleDesc}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
