
import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { BrainCircuit, AlertTriangle, UserCheck } from 'lucide-react';
import { PageLoadingSpinner } from '../components/common/LoadingSpinner';


const translations = {
  en: {
    pageTitle: 'Expert Panel',
    title: 'Expert Panel',
    accessDenied: 'Expert Panel Access Only',
    accessDescription: 'This area is restricted to approved platform experts. Experts review new inventions for novelty, utility, and commercial potential. If you have deep knowledge in a specific field, consider applying.',
    applyButton: 'Apply to be an Expert',
    welcome: 'Welcome, Expert!',
    welcomeDescription: 'Here you can find proofs pending your review. Your contributions are vital to maintaining the integrity of the MindVaultIP ecosystem.',
    loading: 'Verifying expert status...',
    finalDecision: "Final Decision",
  },
  fa: {
    pageTitle: 'پنل متخصصین',
    title: 'پنل متخصصین',
    accessDenied: 'دسترسی فقط برای متخصصین',
    accessDescription: 'این بخش محدود به متخصصین تایید شده پلتفرم است. متخصصین اختراعات جدید را از نظر نوآوری، کاربرد و پتانسیل تجاری بررسی می‌کنند. اگر در زمینه خاصی دانش عمیق دارید، برای عضویت اقدام کنید.',
    applyButton: 'درخواست عضویت به عنوان متخصص',
    welcome: 'خوش آمدید، متخصص!',
    welcomeDescription: 'در اینجا می‌توانید گواهی‌های در انتظار بررسی خود را پیدا کنید. مشارکت شما برای حفظ یکپارچگی اکوسیستم MindVaultIP حیاتی است.',
    loading: 'در حال بررسی وضعیت کارشناسی...',
    finalDecision: "تصمیم نهایی",
  },
  fr: {
    pageTitle: 'Panel d\'Experts',
    title: 'Panel d\'Experts',
    accessDenied: 'Accès Réservé aux Experts',
    accessDescription: 'Cette zone est réservée aux experts approuvés de la plateforme. Les experts examinent les nouvelles inventions pour leur nouveauté, leur utilité et leur potentiel commercial. Si vous avez une connaissance approfondie dans un domaine spécifique, envisagez de postuler.',
    applyButton: 'Postuler pour devenir Expert',
    welcome: 'Bienvenue, Expert !',
    welcomeDescription: 'Vous trouverez ici les preuves en attente de votre examen. Votre contribution est vitale pour maintenir l\'intégrité de l\'écosystème MindVaultIP.',
    loading: 'Vérification du statut d\'expert...',
    finalDecision: 'Décision Finale',
  },
  ru: {
    pageTitle: 'Панель экспертов',
    pageDescription: 'Просматривайте и проверяйте представленные доказательства в вашей области знаний.',
    loadingProofs: 'Загрузка доказательств для проверки...',
    noProofsTitle: 'Очередь на проверку пуста',
    noProofsDescription: 'В настоящее время нет доказательств, ожидающих вашей экспертной оценки. Пожалуйста, зайдите позже.',
    refresh: 'Обновить',
    proofsForReview: 'Доказательства на рассмотрении',
    category: 'Категория',
    submitted: 'Представлено',
    reviewButton: 'Начать проверку',
    startReview: 'Начать проверку',
    cancel: 'Отмена',
    approve: 'Одобрить',
    reject: 'Отклонить',
    submitDecision: 'Отправить решение',
    submitting: 'Отправка...',
    reviewingProof: 'Проверка доказательства',
    fileDetails: 'Детали файла',
    fileName: 'Имя файла',
    fileSize: 'Размер файла',
    fileHash: 'Хэш файла',
    downloadFile: 'Скачать файл для проверки',
    yourDecision: 'Ваше решение',
    decisionSubmitted: 'Решение отправлено',
    thankYou: 'Спасибо за ваш вклад. Следующее доказательство загружается...',
    errorTitle: 'Ошибка',
    notExpert: 'Вы не являетесь утвержденным экспертом.',
    notExpertDescription: 'Эта панель доступна только для утвержденных экспертов. Если вы считаете, что это ошибка, пожалуйста, свяжитесь с поддержкой.',
    applyToBeExpert: 'Подать заявку, чтобы стать экспертом',
    aiScore: 'Оценка ИИ',
    reviewPrompt: 'Ваша задача — тщательно проверить это изобретение на предмет новизны, изобретательского уровня и полезности, а затем принять окончательное решение: одобрить или отклонить.',
    finalDecision: 'Окончательное решение',
  },
  ar: {
    pageTitle: 'لوحة الخبراء',
    title: 'لوحة الخبراء',
    accessDenied: 'الوصول مقتصر على الخبراء فقط',
    accessDescription: 'هذه المنطقة مخصصة لخبراء المنصة المعتمدين. يقوم الخبراء بمراجعة الاختراعات الجديدة من حيث الحداثة والفائدة والإمكانات التجارية. إذا كانت لديك معرفة عميقة في مجال معين، ففكر في التقديم.',
    applyButton: 'قدم لتصبح خبيرًا',
    welcome: 'مرحباً أيها الخبير!',
    welcomeDescription: 'هنا يمكنك العثور على الإثباتات التي تنتظر مراجعتك. مساهماتك حيوية للحفاظ على نزاهة نظام MindVaultIP البيئي.',
    loading: 'جارٍ التحقق من حالة الخبير...',
    finalDecision: 'القرار النهائي',
  },
  hi: {
    pageTitle: 'विशेषज्ञ पैनल',
    title: 'विशेषज्ञ पैनल',
    accessDenied: 'केवल विशेषज्ञ पैनल तक पहुंच',
    accessDescription: 'यह क्षेत्र प्लेटफ़ॉर्म के अनुमोदित विशेषज्ञों के लिए प्रतिबंधित है। विशेषज्ञ नवीनता, उपयोगिता और व्यावसायिक क्षमता के लिए नई आविष्कारों की समीक्षा करते हैं। यदि आपके पास किसी विशिष्ट क्षेत्र में गहरा ज्ञान है, तो आवेदन करने पर विचार करें।',
    applyButton: 'विशेषज्ञ बनने के लिए आवेदन करें',
    welcome: 'स्वागत है, विशेषज्ञ!',
    welcomeDescription: 'यहां आप अपनी समीक्षा के लिए लंबित प्रमाण पा सकते हैं। MindVaultIP पारिस्थितिकी तंत्र की अखंडता को बनाए रखने के लिए आपके योगदान महत्वपूर्ण हैं।',
    loading: 'विशेषज्ञ स्थिति की पुष्टि की जा रही है...',
    finalDecision: 'अंतिम निर्णय',
  },
  ur: {
    pageTitle: 'ماہر پینل',
    title: 'ماہر پینل',
    accessDenied: 'صرف ماہرین تک رسائی',
    accessDescription: 'یہ علاقہ پلیٹ فارم کے منظور شدہ ماہرین تک محدود ہے۔ ماہرین نئی ایجادات کا نیا پن، افادیت اور تجارتی صلاحیت کا جائزہ لیتے ہیں۔ اگر آپ کو کسی مخصوص شعبے میں گہرا علم ہے تو درخواست دینے پر غور کریں۔',
    applyButton: 'ماہر بننے کے لیے درخواست دیں',
    welcome: 'خوش آمدید، ماہر!',
    welcomeDescription: 'یہاں آپ اپنے جائزے کے منتظر ثبوت تلاش کر سکتے ہیں۔ آپ کا تعاون MindVaultIP ماحولیاتی نظام کی سالمیت کو برقرار رکھنے کے لیے اہم ہے۔',
    loading: 'ماہر کی حیثیت کی تصدیق ہو رہی ہے...',
    finalDecision: 'حتمی فیصلہ',
  },
  tr: {
    pageTitle: 'Uzman Paneli',
    title: 'Uzman Paneli',
    accessDenied: 'Yalnızca Uzman Panel Erişimi',
    accessDescription: 'Bu alan, platformun onaylı uzmanlarına özeldir. Uzmanlar, yeni buluşları yenilik, fayda ve ticari potansiyel açısından inceler. Belirli bir alanda derin bilgiye sahipseniz, başvuruda bulunmayı düşünebilirsiniz.',
    applyButton: 'Uzman Olmak İçin Başvur',
    welcome: 'Hoş Geldiniz, Uzman!',
    welcomeDescription: 'Burada incelemenizi bekleyen kanıtları bulabilirsiniz. Katkılarınız, MindVaultIP ekosisteminin bütünlüğünü korumak için hayati önem taşımaktadır.',
    loading: 'Uzman durumu doğrulanıyor...',
    finalDecision: 'Nihai Karar',
  },
  de: {
    pageTitle: 'Expertengremium',
    title: 'Expertengremium',
    accessDenied: 'Zugriff nur für das Expertengremium',
    accessDescription: 'Dieser Bereich ist nur für zugelassene Plattform-Experten zugänglich. Experten überprüfen neue Erfindungen auf Neuheit, Nützlichkeit und kommerzielles Potenzial. Wenn Sie über fundierte Kenntnisse in einem bestimmten Bereich verfügen, sollten Sie eine Bewerbung in Betracht ziehen.',
    applyButton: 'Als Experte bewerben',
    welcome: 'Willkommen, Experte!',
    welcomeDescription: 'Hier finden Sie Nachweise, die auf Ihre Überprüfung warten. Ihre Beiträge sind entscheidend für die Aufrechterhaltung der Integrität des MindVaultIP-Ökosystems.',
    loading: 'Expertenstatus wird überprüft...',
    finalDecision: 'Endgültige Entscheidung',
  },
  zh: {
    pageTitle: '专家面板',
    title: '专家面板',
    accessDenied: '仅限专家面板访问',
    accessDescription: '此区域仅限于平台批准的专家。专家负责审查新发明的创新性、实用性和商业潜力。如果您在特定领域拥有深厚的知识，可以考虑申请。',
    applyButton: '申请成为专家',
    welcome: '欢迎，专家！',
    welcomeDescription: '您的贡献对于维护MindVaultIP生态系统的完整性至关重要。',
    loading: '正在验证专家身份...',
    finalDecision: '最终决定',
  },
  ja: {
    pageTitle: '専門家パネル',
    title: '専門家パネル',
    accessDenied: '専門家パネルへのアクセスのみ',
    accessDescription: 'このエリアは、プラットフォームの承認された専門家に限定されています。専門家は、新規性、有用性、および商業的可能性について新しい発明をレビューします。特定の分野で深い知識をお持ちの場合は、応募を検討してください。',
    applyButton: '専門家として応募する',
    welcome: 'ようこそ、専門家！',
    welcomeDescription: 'ここでは、レビュー待ちの証明を見つけることができます。あなたの貢献は、MindVaultIPエコシステムの完全性を維持するために不可欠です。',
    loading: '専門家のステータスを確認中...',
    finalDecision: '最終決定',
  },
  ko: {
    pageTitle: '전문가 패널',
    title: '전문가 패널',
    accessDenied: '전문가 패널 접근 전용',
    accessDescription: '이 영역은 승인된 플랫폼 전문가에게만 제한됩니다. 전문가는 새로운 발명의 신규성, 유용성 및 상업적 잠재력을 검토합니다. 특정 분야에 대한 깊은 지식이 있는 경우 지원을 고려해 보세요.',
    applyButton: '전문가로 지원하기',
    welcome: '환영합니다, 전문가님!',
    welcomeDescription: '여기에서 검토 대기 중인 증명을 찾을 수 있습니다. 귀하의 기여는 MindVaultIP 생태계의 무결성을 유지하는 데 필수적입니다.',
    loading: '전문가 상태 확인 중...',
    finalDecision: '최종 결정',
  },
  es: {
    pageTitle: 'Panel de Expertos',
    title: 'Panel de Expertos',
    accessDenied: 'Acceso Solo para el Panel de Expertos',
    accessDescription: 'Esta área está restringida a los expertos aprobados de la plataforma. Los expertos revisan nuevos inventos en cuanto a novedad, utilidad y potencial comercial. Si tienes un profundo conocimiento en un campo específico, considera aplicar.',
    applyButton: 'Aplicar para ser Experto',
    welcome: '¡Bienvenido, Experto!',
    welcomeDescription: 'Aquí encontrarás pruebas pendientes de tu revisión. Tu contribución es vital para mantener la integridad del ecosistema de MindVaultIP.',
    loading: 'Verificando estado de experto...',
    finalDecision: 'Decisión Final',
  },
  sw: {
    pageTitle: 'Jopo la Wataalamu',
    title: 'Jopo la Wataalamu',
    accessDenied: 'Ufikiaji wa Jopo la Wataalamu Pekee',
    accessDescription: 'Eneo hili limetengwa kwa ajili ya wataalamu walioidhinishwa wa jukwaa. Wataalamu hupitia uvumbuzi mpya kwa upya, manufaa, na uwezo wa kibiashara. Ikiwa una ujuzi wa kina katika fani maalum, fikiria kuomba.',
    applyButton: 'Omba Kuwa Mtaalamu',
    welcome: 'Karibu, Mtaalamu!',
    welcomeDescription: 'Hapa unaweza kupata ithibati zinazosubiri ukaguzi wako. Mchango wako ni muhimu katika kudumisha uadilifu wa mfumo wa ikolojia wa MindVaultIP.',
    loading: 'Inathibitisha hadhi ya mtaalamu...',
    finalDecision: 'Uamuzi wa Mwisho',
  },
  yo: {
    pageTitle: 'Igbimọ Amoye',
    title: 'Igbimọ Amoye',
    accessDenied: 'Wiwọle fun Igbimọ Amoye Nikan',
    accessDescription: 'Agbegbe yii wa fun awọn amoye ti a fọwọsi lori pẹpẹ. Awọn amoye n ṣe atunyẹwo awọn ipilẹṣẹ tuntun fun tuntun, iwulo, ati agbara iṣowo. Ti o ba ni imọ jinlẹ ni aaye kan pato, ronu lati bere.',
    applyButton: 'Bere lati Di Amoye',
    welcome: 'Kaabọ, Amoye!',
    welcomeDescription: 'Nibi o le wa awọn ẹri ti n duro de atunyẹwo rẹ. Awọn ilowosi rẹ ṣe pataki si mimu iduroṣinṣin ti ilolupo MindVaultIP.',
    loading: 'N ṣayẹwo ipo amoye...',
    finalDecision: 'Ipinnu Ipari',
  },
  ha: {
    pageTitle: 'Kwamitin Kwararru',
    title: 'Kwamitin Kwararru',
    accessDenied: 'Shiga Kwamitin Kwararru Kadai',
    accessDescription: 'Wannan yanki an keɓe shi ne don ƙwararrun da aka amince da su na dandalin. Ƙwararru suna duba sabbin abubuwan ƙirƙira don sabuntawa, amfani, da yuwuwar kasuwanci. Idan kana da zurfin ilimi a wani fanni na musamman, ka yi la\'akari da nema.',
    applyButton: 'Nemi Zama Kwararre',
    welcome: 'Barka da zuwa, Kwararre!',
    welcomeDescription: 'Anan zaku iya samun tabbaci da ke jiran bita. Gudunmawar ku tana da mahimmanci wajen kiyaye mutuncin yanayin MindVaultIP.',
    loading: 'Ana tabbatar da matsayin kwararre...',
    finalDecision: 'Hukunci na Karshe',
  },
  bal: {
    pageTitle: 'ماہرانی پنل',
    title: 'ماہرانی پنل',
    accessDenied: 'فقط ماہرانی رسائی',
    accessDescription: 'اے حصہ فقط پلیٹ فارم ءِ منظور بوتگیں ماہرانی واستہ اِنت. ماہران نوکیں ایجاداں نوآوری، افادیت، ءُ تجارتی صلاحیت ءِ واستہ جائزہ گرنت. اگاں ترا یک خاصیں فیلڈ ءِ تہ ءَ گیشتریں علم است، درخواست دیگ ءِ باروا بچار.',
    applyButton: 'ماہر بوگ ءِ واستہ درخواست کن',
    welcome: 'وش اتک ئے، ماہر!',
    welcomeDescription: 'ادا تئو آ گواھیاں دیست کنے کہ تئی جائزہ ءِ واستہ منتظر اَنت. تئی کمک MindVaultIP ءِ ماحولیاتی نظام ءِ سالمیت ءَ را برقرار دارگ ءِ واستہ باز ضروری اِنت.',
    loading: 'ماہر ءِ حیثیت ءِ تصدیق بوھگ ءَ اِنت...',
    finalDecision: 'آخری فیصلہ',
  },
};

export default function ExpertDashboard() {
  const [isExpert, setIsExpert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    const handleLanguageChange = () => setLanguage(localStorage.getItem('lang') || 'en');
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const checkExpertStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const me = await base44.auth.me();
      setIsExpert(me?.is_expert || false);
    } catch (error) {
      console.error("Failed to verify expert status", error);
      setIsExpert(false);
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependency array is now empty

  useEffect(() => {
    checkExpertStatus();
  }, [checkExpertStatus]);

  const t = translations[language] || translations.en;

  if (isLoading) {
    return <PageLoadingSpinner text={t.loading} />;
  }

  const AccessDeniedView = () => (
    <div className="flex items-center justify-center h-full p-8">
        <div className="text-center glow-card p-8 md:p-12 rounded-2xl max-w-lg">
            <AlertTriangle className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">{t.accessDenied}</h2>
            <p className="text-gray-400 mb-8">{t.accessDescription}</p>
            <Link to={createPageUrl('ApplyExpert')}>
                <Button className="glow-button font-semibold">
                    <UserCheck className="w-5 h-5 mr-2" />
                    {t.applyButton}
                </Button>
            </Link>
        </div>
    </div>
  );

  const ExpertView = () => (
    <div className="p-4 md:p-8">
        <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="w-8 h-8 text-[#00E5FF]" />
            <h1 className="text-3xl font-bold text-white">{t.welcome}</h1>
        </div>
        <p className="text-lg text-gray-400 mb-8">{t.welcomeDescription}</p>
        {/* TODO: Add list of proofs for review */}
        <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-2xl">
            <p className="text-gray-500">Proof review section coming soon.</p>
        </div>
    </div>
  );

  return (
    <div className="h-full" dir={['fa', 'ar', 'ur', 'hi', 'bal', 'tr', 'zh', 'ko', 'es', 'fr', 'sw', 'yo'].includes(language) ? 'rtl' : 'ltr'}>
      {isExpert ? <ExpertView /> : <AccessDeniedView />}
    </div>
  );
}
