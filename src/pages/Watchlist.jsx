
import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Bookmark, ShoppingCart } from 'lucide-react';
import ProofCard from '../components/dashboard/ProofCard';
import { PageLoadingSpinner } from '../components/common/LoadingSpinner';

const translations = {
  en: {
    title: 'My Watchlist',
    description: 'Keep track of intellectual properties you are interested in.',
    emptyTitle: 'Your Watchlist is Empty',
    emptyDescription: 'Browse the Marketplace or Gallery and click the bookmark icon to add proofs to your watchlist.',
    browseMarketplace: 'Browse Marketplace',
    loading: 'Loading your watchlist...'
  },
  fa: {
    title: 'لیست پیگیری من',
    description: 'دارایی‌های معنوی مورد علاقه خود را پیگیری کنید.',
    emptyTitle: 'لیست پیگیری شما خالی است',
    emptyDescription: 'در بازار یا گالری جستجو کنید و روی آیکون بوکمارک کلیک کنید تا گواهی‌ها به لیست پیگیری شما اضافه شوند.',
    browseMarketplace: 'مشاهده بازار',
    loading: 'در حال بارگذاری لیست پیگیری...'
  },
  es: {
    title: 'Mi Lista de seguimiento',
    description: 'Realice un seguimiento de las propiedades intelectuales que le interesan.',
    emptyTitle: 'Tu lista de seguimiento está vacía',
    emptyDescription: 'Navegue por el Mercado o la Galería y haga clic en el icono de marcador para agregar pruebas a su lista de seguimiento.',
    browseMarketplace: 'Explorar Mercado',
    loading: 'Cargando tu lista de seguimiento...'
  },
  ru: {
    title: 'Мой список наблюдения',
    description: 'Следите за интеллектуальной собственностью, которая вас интересует.',
    emptyTitle: 'Ваш список наблюдения пуст',
    emptyDescription: 'Просматривайте Рынок или Галерею и нажимайте на значок закладки, чтобы добавлять доказательства в свой список наблюдения.',
    browseMarketplace: 'Перейти на Рынок',
    loading: 'Загрузка вашего списка наблюдения...'
  },
  fr: {
    title: 'Ma Liste de Surveillance',
    description: 'Suivez les propriétés intellectuelles qui vous intéressent.',
    emptyTitle: 'Votre Liste de Surveillance est Vide',
    emptyDescription: 'Parcourez le Marché ou la Galerie et cliquez sur l\'icône de signet pour ajouter des preuves à votre liste de surveillance.',
    browseMarketplace: 'Parcourir le Marché',
    loading: 'Chargement de votre liste de surveillance...'
  },
  ar: {
    title: 'قائمة المراقبة الخاصة بي',
    description: 'تتبع الملكيات الفكرية التي تهتم بها.',
    emptyTitle: 'قائمة المراقبة الخاصة بك فارغة',
    emptyDescription: 'تصفح السوق أو المعرض وانقر على أيقونة الإشارة المرجعية لإضافة الإثباتات إلى قائمة المراقبة الخاصة بك.',
    browseMarketplace: 'تصفح السوق',
    loading: 'جاري تحميل قائمة المراقبة...'
  },
  hi: {
    title: 'मेरी वॉचलिस्ट',
    description: 'उन बौद्धिक संपत्तियों पर नज़र रखें जिनमें आपकी रुचि है।',
    emptyTitle: 'आपकी वॉचलिस्ट खाली है',
    emptyDescription: 'मार्केटप्लेस या गैलरी ब्राउज़ करें और अपनी वॉचलिस्ट में सबूत जोड़ने के लिए बुकमार्क आइकन पर क्लिक करें।',
    browseMarketplace: 'मार्केटप्लेस ब्राउज़ करें',
    loading: 'आपकी वॉचलिस्ट लोड हो रही है...'
  },
  ur: {
    title: 'میری واچ لسٹ',
    description: 'ان دانشورانہ املاک پر نظر رکھیں جن میں آپ دلچسپی رکھتے ہیں۔',
    emptyTitle: 'آپ کی واچ لسٹ خالی ہے',
    emptyDescription: 'مارکیٹ پلیس یا گیلری کو براؤز کریں اور اپنی واچ لسٹ میں ثبوت شامل کرنے کے لیے بک مارک آئیکن پر کلک کریں۔',
    browseMarketplace: 'مارکیٹ پلیس براؤز کریں',
    loading: 'آپ کی واچ لسٹ لوڈ ہو رہی ہے...'
  },
  tr: {
    title: 'İzleme Listem',
    description: 'İlgilendiğiniz fikri mülkiyetleri takip edin.',
    emptyTitle: 'İzleme Listeniz Boş',
    emptyDescription: 'Pazaryerini veya Galeriyi gezin ve izleme listenize kanıt eklemek için yer imi simgesine tıklayın.',
    browseMarketplace: 'Pazaryerini Keşfet',
    loading: 'İzleme listeniz yükleniyor...'
  },
  de: {
    title: 'Meine Beobachtungsliste',
    description: 'Behalten Sie die geistigen Eigentumsrechte im Auge, an denen Sie interessiert sind.',
    emptyTitle: 'Ihre Beobachtungsliste ist leer',
    emptyDescription: 'Durchsuchen Sie den Marktplatz oder die Galerie und klicken Sie auf das Lesezeichen-Symbol, um Nachweise zu Ihrer Beobachtungsliste hinzuzufügen.',
    browseMarketplace: 'Marktplatz durchsuchen',
    loading: 'Ihre Beobachtungsliste wird geladen...'
  },
  zh: {
    title: '我的关注列表',
    description: '跟踪您感兴趣的知识产权。',
    emptyTitle: '您的关注列表是空的',
    emptyDescription: '浏览市场或画廊，然后单击书签图标将证明添加到您的关注列表中。',
    browseMarketplace: '浏览市场',
    loading: '正在加载您的关注列表...'
  },
  ja: {
    title: '私のウォッチリスト',
    description: '興味のある知的財産を追跡します。',
    emptyTitle: 'ウォッチリストは空です',
    emptyDescription: 'マーケットプレイスやギャラリーを閲覧し、ブックマークアイコンをクリックしてウォッチリストに証明を追加してください。',
    browseMarketplace: 'マーケットプレイスを閲覧',
    loading: 'ウォッチリストを読み込み中...'
  },
  ko: {
    title: '내 관심 목록',
    description: '관심 있는 지적 재산을 추적하세요.',
    emptyTitle: '관심 목록이 비어 있습니다',
    emptyDescription: '마켓플레이스나 갤러리를 둘러보고 북마크 아이콘을 클릭하여 관심 목록에 증명을 추가하세요.',
    browseMarketplace: '마켓플레이스 둘러보기',
    loading: '관심 목록을 불러오는 중...'
  },
  sw: {
    title: 'Orodha Yangu ya Ufuatiliaji',
    description: 'Fuatilia miliki za kiakili unazopenda.',
    emptyTitle: 'Orodha Yako ya Ufuatiliaji Iko Tupu',
    emptyDescription: 'Vinjari Soko au Galeri na bofya ikoni ya alamisho ili kuongeza ithibati kwenye orodha yako ya ufuatiliaji.',
    browseMarketplace: 'Vinjari Soko',
    loading: 'Inapakia orodha yako ya ufuatiliaji...'
  },
  yo: {
    title: 'Akojọ Abojuto Mi',
    description: 'Tọpinpin awọn ohun-ini ọgbọn ti o nifẹ si.',
    emptyTitle: 'Akojọ Abojuto Rẹ Ti Ofo',
    emptyDescription: 'Ṣawari Ibi ọja tabi Aworan ki o tẹ aami bukumaaki lati ṣafikun awọn ẹri si akojọ abojuto rẹ.',
    browseMarketplace: 'Ṣawari Ibi ọja',
    loading: 'N ṣajọpọ akojọ abojuto rẹ...'
  },
  ha: {
    title: 'Jerin Kula na',
    description: 'Bibiyar kadarorin hankali da kake sha\'awa.',
    emptyTitle: 'Jerin Kula naka Ba Shi da Komai',
    emptyDescription: 'Bincika Kasuwa ko Gallery kuma danna alamar alamar shafi don ƙara tabbaci zuwa jerin kula naka.',
    browseMarketplace: 'Bincika Kasuwa',
    loading: 'Ana loda jerin kula naka...'
  },
  bal: {
    title: 'منی واچ لسٹ',
    description: 'آ دانشورانہ ملکیتانی سرا نظر بہ دار کہ تئو آیاناں دوست دارے.',
    emptyTitle: 'تئی واچ لسٹ ھالیگ اِنت',
    emptyDescription: 'بازار یا گیلری ءَ بچار ءُ وتی واچ لسٹ ءِ تہ ءَ گواهیانی اضافگ کنگ ءِ ھاتر ءَ بکمارک آئیکن ءَ کلک کن.',
    browseMarketplace: 'بازار ءَ بچار',
    loading: 'تئی واچ لسٹ لوڈ بوھگ ءَ اِنت...'
  }
};

export default function WatchlistPage() {
  const [watchedProofs, setWatchedProofs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    const handleLanguageChange = () => setLanguage(localStorage.getItem('lang') || 'en');
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const fetchWatchlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const me = await base44.auth.me();
      if (me && me.watchlist && me.watchlist.length > 0) {
        const proofs = await base44.entities.Proof.filter({ id: { $in: me.watchlist } });
        setWatchedProofs(proofs || []);
      } else {
        setWatchedProofs([]);
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      setWatchedProofs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleProofUpdate = (updatedProof) => {
    // This could be triggered by un-bookmarking a proof from its card
    if (updatedProof.watchlist_updated) {
        fetchWatchlist(); // Re-fetch the whole list if a bookmark was changed
    } else {
        setWatchedProofs(currentProofs =>
            currentProofs.map(p => p.id === updatedProof.id ? updatedProof : p)
        );
    }
  };

  const t = translations[language] || translations.en;
  
  if (isLoading) {
    return <PageLoadingSpinner text={t.loading} />;
  }

  return (
    <div className="p-4 md:p-8" dir={['fa', 'ar', 'ur', 'bal', 'ru', 'hi', 'ja', 'ha'].includes(language) ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
            <Bookmark className="w-8 h-8 text-[#00E5FF]" />
            <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        </div>
        <p className="text-lg text-gray-400 mb-8">{t.description}</p>
        
        {watchedProofs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchedProofs.map(proof => (
              <ProofCard key={proof.id} proof={proof} onUpdate={handleProofUpdate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glow-card rounded-2xl">
            <Bookmark className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">{t.emptyTitle}</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">{t.emptyDescription}</p>
            <Link to={createPageUrl('Marketplace')}>
              <Button className="glow-button font-semibold">
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t.browseMarketplace}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
