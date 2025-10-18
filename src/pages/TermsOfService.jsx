
import React from 'react';
import { FileText } from 'lucide-react';

const translations = {
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last Updated: September 21, 2025',
    introduction: 'Welcome to MindVaultIP. These Terms of Service ("Terms") govern your access to and use of our decentralized intellectual property platform. By using our services, you agree to be bound by these Terms.',
    section1: '1. Account & Wallet Security',
    section1Text: 'You are responsible for the security of your connected wallet. MindVaultIP does not store your private keys and cannot access your funds. All transactions you initiate are your own responsibility.',
    section2: '2. Intellectual Property Rights',
    section2Text: 'By uploading content to create a Proof, you represent and warrant that you own the intellectual property rights to that content. You grant MindVaultIP a limited license to use this content for the purpose of operating the platform, including creating a hash and performing AI analysis.',
    section3: '3. Prohibited Conduct',
    section3Text: 'You agree not to upload content that is illegal, infringing on third-party rights, fraudulent, or malicious. We reserve the right to remove any content and suspend any user found to be in violation of these terms.',
    section4: '4. AI Council and Disclaimers',
    section4Text: 'The AI Council\'s analysis is provided for informational purposes only and does not constitute legal advice or a guarantee of patentability. While we strive for accuracy, the AI\'s decision is not a substitute for professional legal counsel.',
    section5: '5. Marketplace & Transactions',
    section5Text: 'All transactions on the marketplace are final and recorded on the blockchain. MindVaultIP is not a party to any transaction between users and is not responsible for any losses or disputes.',
    section6: '6. Limitation of Liability',
    section6Text: 'MindVaultIP is provided "as is" without any warranties. To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages.',
    section7: '7. Changes to Terms',
    section7Text: 'We may modify these Terms at any time. We will provide notice of changes, and your continued use of the platform will constitute acceptance of the new Terms.',
  },
  fa: {
    title: 'شرایط خدمات',
    lastUpdated: 'آخرین بروزرسانی: ۲۱ سپتامبر ۲۰۲۵',
    introduction: 'به MindVaultIP خوش آمدید. این شرایط خدمات ("شرایط") دسترسی و استفاده شما از پلتفرم غیرمتمرکز مالکیت معنوی ما را کنترل می‌کند. با استفاده از خدمات ما، شما موافقت خود را با پایبندی به این شرایط اعلام می‌کنید.',
    section1: '۱. حساب کاربری و امنیت کیف پول',
    section1Text: 'شما مسئول امنیت کیف پول متصل خود هستید. MindVaultIP کلیدهای خصوصی شما را ذخیره نمی‌کند و به وجوه شما دسترسی ندارد. تمام تراکنش‌هایی که شما آغاز می‌کنید، مسئولیت خودتان است.',
    section2: '۲. حقوق مالکیت معنوی',
    section2Text: 'با بارگذاری محتوا برای ایجاد یک گواهی، شما اظهار و تضمین می‌کنید که مالک حقوق مالکیت معنوی آن محتوا هستید. شما به MindVaultIP یک مجوز محدود برای استفاده از این محتوا به منظور بهره‌برداری از پلتفرم، از جمله ایجاد هش و انجام تحلیل هوش مصنوعی، اعطا می‌کنید.',
    section3: '۳. رفتار ممنوعه',
    section3Text: 'شما موافقت می‌کنید که محتوای غیرقانونی، ناقض حقوق شخص ثالث، متقلبانه یا مخرب را بارگذاری نکنید. ما حق حذف هرگونه محتوا و تعلیق هر کاربری را که این شرایط را نقض کند، برای خود محفوظ می‌داریم.',
    section4: '۴. شورای هوش مصنوعی و سلب مسئولیت‌ها',
    section4Text: 'تحلیل شورای هوش مصنوعی فقط برای اهداف اطلاعاتی ارائه شده و به منزله مشاوره حقوقی یا تضمین قابلیت ثبت اختراع نیست. در حالی که ما برای دقت تلاش می‌کنیم، تصمیم هوش مصنوعی جایگزین مشاوره حقوقی حرفه‌ای نیست.',
    section5: '۵. بازار و تراکنش‌ها',
    section5Text: 'تمام تراکنش‌ها در بازار نهایی بوده و بر روی بلاکچین ثبت می‌شوند. MindVaultIP طرف هیچ معامله‌ای بین کاربران نیست و مسئولیتی در قبال هرگونه ضرر و زیان یا اختلاف ندارد.',
    section6: '۶. محدودیت مسئولیت',
    section6Text: 'MindVaultIP "همانطور که هست" و بدون هیچ گونه ضمانتی ارائه می‌شود. تا جایی که قانون اجازه می‌دهد، ما در قبال هیچ گونه خسارت غیرمستقیم، اتفاقی، ویژه، تبعی یا تنبیهی مسئولیتی نخواهیم داشت.',
    section7: '۷. تغییرات در شرایط',
    section7Text: 'ما ممکن است این شرایط را در هر زمان اصلاح کنیم. ما اطلاع‌رسانی در مورد تغییرات را ارائه خواهیم داد و ادامه استفاده شما از پلتفرم به منزله پذیرش شرایط جدید خواهد بود.',
  },
  ar: {
    title: 'شروط الخدمة',
    lastUpdated: 'آخر تحديث: 21 سبتمبر 2025',
    introduction: 'مرحبًا بك في MindVaultIP. تحكم شروط الخدمة هذه ("الشروط") وصولك واستخدامك لمنصتنا اللامركزية للملكية الفكرية. باستخدام خدماتنا، فإنك توافق على الالتزام بهذه الشروط.',
    section1: '1. الحساب وأمان المحفظة',
    section1Text: 'أنت مسؤول عن أمان محفظتك المتصلة. لا تقوم MindVaultIP بتخزين مفاتيحك الخاصة ولا يمكنها الوصول إلى أموالك. جميع المعاملات التي تبدأها هي مسؤوليتك الخاصة.',
    section2: '2. حقوق الملكية الفكرية',
    section2Text: 'بتحميل محتوى لإنشاء إثبات، فإنك تقر وتضمن أنك تمتلك حقوق الملكية الفكرية لهذا المحتوى. أنت تمنح MindVaultIP ترخيصًا محدودًا لاستخدام هذا المحتوى لغرض تشغيل المنصة، بما في ذلك إنشاء تجزئة وإجراء تحليل بالذكاء الاصطناعي.',
    section3: '3. السلوك المحظور',
    section3Text: 'أنت توافق على عدم تحميل محتوى غير قانوني أو ينتهك حقوق الغير أو احتيالي أو ضار. نحتفظ بالحق في إزالة أي محتوى وتعليق أي مستخدم يتبين أنه ينتهك هذه الشروط.',
    section4: '4. مجلس الذكاء الاصطناعي وإخلاء المسؤولية',
    section4Text: 'يتم توفير تحليل مجلس الذكاء الاصطناعي لأغراض إعلامية فقط ولا يشكل استشارة قانونية أو ضمانًا لقابلية الحصول على براءة اختراع. بينما نسعى جاهدين للدقة، فإن قرار الذكاء الاصطناعي ليس بديلاً عن المشورة القانونية المتخصصة.',
    section5: '5. السوق والمعاملات',
    section5Text: 'جميع المعاملات في السوق نهائية ومسجلة على البلوك تشين. MindVaultIP ليست طرفًا في أي معاملة بين المستخدمين وليست مسؤولة عن أي خسائر أو نزاعات.',
    section6: '6. تحديد المسؤولية',
    section6Text: 'يتم توفير MindVaultIP "كما هي" دون أي ضمانات. إلى أقصى حد يسمح به القانون، لن نكون مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية.',
    section7: '7. التغييرات على الشروط',
    section7Text: 'قد نقوم بتعديل هذه الشروط في أي وقت. سنقدم إشعارًا بالتغييرات، وسيشكل استمرارك في استخدام المنصة قبولًا للشروط الجديدة.',
  },
  tr: {
    title: 'Hizmet Şartları',
    lastUpdated: 'Son Güncelleme: 21 Eylül 2025',
    introduction: 'MindVaultIP\'ye hoş geldiniz. Bu Hizmet Şartları ("Şartlar"), merkezi olmayan fikri mülkiyet platformumuza erişiminizi ve kullanımınızı yönetir. Hizmetlerimizi kullanarak, bu Şartlara bağlı kalmayı kabul etmiş olursunuz.',
    section1: '1. Hesap ve Cüzdan Güvenliği',
    section1Text: 'Bağlı cüzdanınızın güvenliğinden siz sorumlusunuz. MindVaultIP özel anahtarlarınızı saklamaz ve fonlarınıza erişemez. Başlattığınız tüm işlemler sizin sorumluluğunuzdadır.',
    section2: '2. Fikri Mülkiyet Hakları',
    section2Text: 'Bir Kanıt oluşturmak için içerik yükleyerek, o içeriğin fikri mülkiyet haklarına sahip olduğunuzu beyan ve garanti edersiniz. MindVaultIP\'ye, bir özet oluşturma ve AI analizi yapma dahil olmak üzere platformu işletme amacıyla bu içeriği kullanması için sınırlı bir lisans verirsiniz.',
    section3: '3. Yasaklanmış Davranışlar',
    section3Text: 'Yasadışı, üçüncü taraf haklarını ihlal eden, hileli veya kötü niyetli içerik yüklememeyi kabul edersiniz. Bu şartları ihlal ettiği tespit edilen herhangi bir içeriği kaldırma ve herhangi bir kullanıcıyı askıya alma hakkını saklı tutarız.',
    section4: '4. Yapay Zeka Konseyi ve Sorumluluk Reddi',
    section4Text: 'Yapay Zeka Konseyi\'nin analizi yalnızca bilgilendirme amaçlıdır ve yasal tavsiye veya patentlenebilirlik garantisi teşkil etmez. Doğruluk için çabalasak da, Yapay Zeka\'nın kararı profesyonel yasal danışmanlığın yerini tutmaz.',
    section5: '5. Pazaryeri ve İşlemler',
    section5Text: 'Pazaryerindeki tüm işlemler nihaidir ve blok zincirine kaydedilir. MindVaultIP, kullanıcılar arasındaki herhangi bir işlemin tarafı değildir ve herhangi bir kayıp veya anlaşmazlıktan sorumlu değildir.',
    section6: '6. Sorumluluğun Sınırlandırılması',
    section6Text: 'MindVaultIP "olduğu gibi" ve herhangi bir garanti olmaksızın sağlanır. Yasaların izin verdiği en geniş ölçüde, dolaylı, arızi, özel, sonuçsal veya cezai zararlardan sorumlu olmayacağız.',
    section7: '7. Şartlardaki Değişiklikler',
    section7Text: 'Bu Şartları herhangi bir zamanda değiştirebiliriz. Değişiklikler hakkında bildirimde bulunacağız ve platformu kullanmaya devam etmeniz yeni Şartları kabul ettiğiniz anlamına gelecektir.',
  },
  bal: {
    title: 'خدمتانی شرائط',
    lastUpdated: 'آخری اپڈیٹ: 21 ستمبر 2025',
    introduction: 'مائنڈ والٹ آئی پی ءَ وش آتک کن ئے. اے خدمتانی شرائط ("شرائط") مئے غیرمرکزی интеллектуаلی ملکیت ءِ پلیٹ فارم ءَ تئی دسترسی ءُ کارمرزی ءَ کنٹرول کننت. مئے خدمات ءِ کارمرزی ءَ گوں، تئو اے شرائط ءِ پابندی ءَ قبول کن ئے.',
    section1: '۱. اکاؤنٹ ءُ والٹ سیکورٹی',
    section1Text: 'تئو وتی کنکٹ بوتگیں والٹ ءِ سیکورٹی ءِ ذمہ دار ئے. مائنڈ والٹ آئی پی تئی پرائیویٹ کیز ءَ ذخیره نہ کنت ءُ تئی فنڈز ءَ دسترسی نہ داریت. کل آ ٹرانزیکشنز کہ تئو شروع کن ئے، تئی وتی ذمہ داری اَنت.',
    section2: '۲. интеллектуаلی ملکیت ءِ حقوق',
    section2Text: 'یک گواهی جوڑ کنگ ءِ واست ءَ مواد اپلوڈ کنگ ءَ گوں، تئو بیان ءُ ضمانت کن ئے کہ تئو آ مواد ءِ интеллектуаلی ملکیت ءِ حقوق ءِ مالک ئے. تئو مائنڈ والٹ آئی پی ءَ یک محدودیں لائسنس دئے ئے کہ اے مواد ءَ پلیٹ فارم ءِ چلینگ ءِ مقصد ءِ واست ءَ کارمرزی بکنت، کہ آئی تہ ءَ یک ہیش جوڑ کنگ ءُ AI ءِ تجزیه و تحلیل کنگ ہوار اِنت.',
    section3: '۳. ممنوعیں رویہ',
    section3Text: 'تئو قبول کن ئے کہ غیرقانونی، سییمی پارٹی ءِ حقوق ءِ خلاف ورزی کنۆک، فراڈی، یا दुर्भावनापूर्ण مواد اپلوڈ نہ کن ئے. ما حق داریں کہ ہر آ مواد ءَ دور بکنیں ءُ هر آ کارمرز ءَ معطل بکنیں کہ اے شرائط ءِ خلاف ورزی کنت.',
    section4: '۴. AI کونسل ءُ دستبرداری',
    section4Text: 'AI کونسل ءِ تجزیه و تحلیل فقط معلوماتی مقاصد ءِ واست ءَ فراہم کورتگ بیت ءُ قانونی مشورہ یا پیٹنٹ قابلیت ءِ ضمانت نہ دنت. در حالیکہ ما درستی ءِ واست ءَ کوشش کنیں، AI ءِ فیصلہ پیشہ ورانہ قانونی مشورہ ءِ বিকল্প نہ اِنت.',
    section5: '۵. بازار ءُ ٹرانزیکشنز',
    section5Text: 'بازار ءِ تہ ءَ کل ٹرانزیکشنز حتمی اَنت ءُ بلاکچین ءِ سرا ثبت بنت. مائنڈ والٹ آئی پی کارمرزانی نیام ءَ هچ ٹرانزیکشن ءِ یک پارٹی نہ اِنت ءُ هچ نقصان یا اختلاف ءِ ذمہ دار نہ اِنت.',
    section6: '۶. ذمہ داری ءِ حد',
    section6Text: 'مائنڈ والٹ آئی پی "همینطور کہ هست" ءُ هچ ضمانت ءِ بغیر فراہم کورتگ بیت. قانون ءِ اجازت داتگیں حد تک، ما هچ غیر مستقیم، اتفاقی، خاص، نتیجتاً، یا تادیبی نقصان ءِ ذمہ دار نہ بئیں.',
    section7: '۷. شرائط ءِ تہ ءَ تبدیلی',
    section7Text: 'ما اے شرائط ءَ هر وخت ءَ ترمیم کُت کناں. ما تبدیلیانی باروا ءَ اطلاع دئیں، ءُ تئی پلیٹ فارم ءِ کارمرزی ءِ ادامہ دیگ نوکیں شرائط ءِ قبول کنگ ءِ مطلب بیت.',
  }
};

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
    <p className="text-gray-300 leading-relaxed">{children}</p>
  </section>
);

export default function TermsOfServicePage() {
  const [language] = React.useState(localStorage.getItem('lang') || 'en');
  const t = translations[language] || translations.en;

  return (
    <div className="bg-[#0B1220] text-white" dir={['fa', 'ar', 'tr', 'bal'].includes(language) ? 'rtl' : 'ltr'}>
      <div className="text-center py-16 px-4 bg-[#1a2332]/50">
        <FileText className="w-20 h-20 mx-auto text-[#00E5FF] mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
        <p className="text-gray-400">{t.lastUpdated}</p>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <p className="mb-8 text-lg text-gray-300">{t.introduction}</p>
        <Section title={t.section1}>{t.section1Text}</Section>
        <Section title={t.section2}>{t.section2Text}</Section>
        <Section title={t.section3}>{t.section3Text}</Section>
        <Section title={t.section4}>{t.section4Text}</Section>
        <Section title={t.section5}>{t.section5Text}</Section>
        <Section title={t.section6}>{t.section6Text}</Section>
        {t.section7 && <Section title={t.section7}>{t.section7Text}</Section>}
      </div>
    </div>
  );
}
