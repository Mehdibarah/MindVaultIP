
import React from 'react';
import { Shield } from 'lucide-react';

const translations = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: September 21, 2025',
    introduction: 'Your privacy is critically important to us. At MindVaultIP, we have a few fundamental principles.',
    section1: '1. Information We Collect',
    section1Text: 'We collect your public wallet address when you connect to our platform. We do not collect any other personally identifiable information (PII) unless you voluntarily provide it in your public profile (e.g., name, bio). All on-chain data, such as transaction hashes and proof hashes, is public by nature.',
    section2: '2. How We Use Information',
    section2Text: 'We use your wallet address to associate you with your proofs and activity on the platform. Any information you add to your public profile will be visible to other users. We may use aggregated, anonymized data for analytics and platform improvement.',
    section3: '3. Data Storage and Security',
    section3Text: 'Your core IP proofs are hashed, and the original files are either stored on the decentralized IPFS network (if public) or not stored by us at all (if private). Off-chain data like your user profile is stored securely. We take all reasonable measures to protect against unauthorized access, use, alteration, or destruction of data.',
    section4: '4. Cookies',
    section4Text: 'We use cookies to help us identify and track visitors, their usage of our website, and their website access preferences. You can refuse cookies through your browser settings, though some features of our platform may not function properly without them.',
    section5: '5. Your Choice and Control',
    section5Text: 'You can choose to remain completely anonymous by only using your wallet address. Creating a public profile is optional. You have control over the information you display.',
    section6: '6. Policy Changes',
    section6Text: 'Although most changes are likely to be minor, MindVaultIP may change its Privacy Policy from time to time. We encourage visitors to frequently check this page for any changes.',
  },
  fa: {
    title: 'سیاست حفظ حریم خصوصی',
    lastUpdated: 'آخرین بروزرسانی: ۲۱ سپتامبر ۲۰۲۵',
    introduction: 'حریم خصوصی شما برای ما اهمیت حیاتی دارد. در MindVaultIP، ما چند اصل اساسی داریم.',
    section1: '۱. اطلاعاتی که جمع‌آوری می‌کنیم',
    section1Text: 'هنگامی که به پلتفرم ما متصل می‌شوید، ما آدرس کیف پول عمومی شما را جمع‌آوری می‌کنیم. ما هیچ اطلاعات شناسایی شخصی دیگری (PII) را جمع‌آوری نمی‌کنیم مگر اینکه شما داوطلبانه آن را در پروفایل عمومی خود ارائه دهید (مانند نام، بیوگرافی). تمام داده‌های روی زنجیره، مانند هش‌های تراکنش و هش‌های گواهی، طبیعتاً عمومی هستند.',
    section2: '۲. چگونه از اطلاعات استفاده می‌کنیم',
    section2Text: 'ما از آدرس کیف پول شما برای مرتبط کردن شما با گواهی‌ها و فعالیت‌هایتان در پلتفرم استفاده می‌کنیم. هر اطلاعاتی که به پروفایل عمومی خود اضافه کنید برای سایر کاربران قابل مشاهده خواهد بود. ما ممکن است از داده‌های جمعی و ناشناس برای تجزیه و تحلیل و بهبود پلتفرم استفاده کنیم.',
    section3: '۳. ذخیره‌سازی و امنیت داده‌ها',
    section3Text: 'گواهی‌های IP اصلی شما هش شده و فایل‌های اصلی یا در شبکه غیرمتمرکز IPFS ذخیره می‌شوند (اگر عمومی باشند) یا اصلاً توسط ما ذخیره نمی‌شوند (اگر خصوصی باشند). داده‌های خارج از زنجیره مانند پروفایل کاربری شما به صورت امن ذخیره می‌شوند. ما تمام اقدامات منطقی را برای محافظت در برابر دسترسی، استفاده، تغییر یا تخریب غیرمجاز داده‌ها انجام می‌دهیم.',
    section4: '۴. کوکی‌ها',
    section4Text: 'ما از کوکی‌ها برای شناسایی و ردیابی بازدیدکنندگان، استفاده آن‌ها از وب‌سایت ما و ترجیحات دسترسی به وب‌سایت آن‌ها استفاده می‌کنیم. شما می‌توانید از طریق تنظیمات مرورگر خود کوکی‌ها را رد کنید، اگرچه برخی از ویژگی‌های پلتفرم ما ممکن است بدون آن‌ها به درستی کار نکنند.',
    section5: '۵. انتخاب و کنترل شما',
    section5Text: 'شما می‌توانید با استفاده تنها از آدرس کیف پول خود کاملاً ناشناس بمانید. ایجاد پروفایل عمومی اختیاری است. شما بر اطلاعاتی که نمایش می‌دهید کنترل دارید.',
    section6: '۶. تغییرات در سیاست',
    section6Text: 'اگرچه بیشتر تغییرات احتمالاً جزئی خواهند بود، MindVaultIP ممکن است هر از چند گاهی سیاست حفظ حریم خصوصی خود را تغییر دهد. ما بازدیدکنندگان را تشویق می‌کنیم که به طور مکرر این صفحه را برای هرگونه تغییر بررسی کنند.',
  },
  ar: {
    title: 'سياسة الخصوصية',
    lastUpdated: 'آخر تحديث: 21 سبتمبر 2025',
    introduction: 'خصوصيتك تهمنا بشكل كبير. في MindVaultIP، لدينا بعض المبادئ الأساسية.',
    section1: '1. المعلومات التي نجمعها',
    section1Text: 'نقوم بجمع عنوان محفظتك العامة عند اتصالك بمنصتنا. نحن لا نجمع أي معلومات تعريف شخصية أخرى (PII) ما لم تقدمها طواعية في ملفك الشخصي العام (مثل الاسم، السيرة الذاتية). جميع البيانات الموجودة على السلسلة، مثل تجزئات المعاملات وتجزئات الإثبات، هي عامة بطبيعتها.',
    section2: '2. كيف نستخدم المعلومات',
    section2Text: 'نستخدم عنوان محفظتك لربطك بإثباتاتك ونشاطك على المنصة. أي معلومات تضيفها إلى ملفك الشخصي العام ستكون مرئية للمستخدمين الآخرين. قد نستخدم بيانات مجمعة ومجهولة المصدر للتحليلات وتحسين المنصة.',
    section3: '3. تخزين البيانات وأمانها',
    section3Text: 'يتم تجزئة إثباتات الملكية الفكرية الأساسية الخاصة بك، ويتم تخزين الملفات الأصلية إما على شبكة IPFS اللامركزية (إذا كانت عامة) أو لا يتم تخزينها من قبلنا على الإطلاق (إذا كانت خاصة). يتم تخزين البيانات خارج السلسلة مثل ملفك الشخصي بشكل آمن. نتخذ جميع التدابير المعقولة للحماية من الوصول غير المصرح به أو الاستخدام أو التغيير أو إتلاف البيانات.',
    section4: '4. ملفات تعريف الارتباط (الكوكيز)',
    section4Text: 'نستخدم ملفات تعريف الارتباط لمساعدتنا في تحديد وتتبع الزوار واستخدامهم لموقعنا وتفضيلات الوصول إلى موقعنا. يمكنك رفض ملفات تعريف الارتباط من خلال إعدادات متصفحك، على الرغم من أن بعض ميزات منصتنا قد لا تعمل بشكل صحيح بدونها.',
    section5: '5. اختيارك والتحكم',
    section5Text: 'يمكنك اختيار أن تظل مجهول الهوية تمامًا باستخدام عنوان محفظتك فقط. إنشاء ملف شخصي عام أمر اختياري. لديك السيطرة على المعلومات التي تعرضها.',
    section6: '6. تغييرات السياسة',
    section6Text: 'على الرغم من أن معظم التغييرات من المحتمل أن تكون طفيفة، قد تقوم MindVaultIP بتغيير سياسة الخصوصية الخاصة بها من وقت لآخر. نشجع الزوار على مراجعة هذه الصفحة بشكل متكرر بحثًا عن أي تغييرات.'
  },
  tr: {
    title: 'Gizlilik Politikası',
    lastUpdated: 'Son Güncelleme: 21 Eylül 2025',
    introduction: 'Gizliliğiniz bizim için kritik öneme sahiptir. MindVaultIP\'de birkaç temel prensibimiz var.',
    section1: '1. Topladığımız Bilgiler',
    section1Text: 'Platformumuza bağlandığınızda genel cüzdan adresinizi toplarız. Genel profilinizde (ör. isim, biyografi) gönüllü olarak sağlamadığınız sürece başka hiçbir kişisel olarak tanımlanabilir bilgi (PII) toplamayız. İşlem özetleri ve kanıt özetleri gibi tüm zincir üstü veriler doğası gereği halka açıktır.',
    section2: '2. Bilgileri Nasıl Kullanıyoruz',
    section2Text: 'Cüzdan adresinizi, platformdaki kanıtlarınız ve etkinliğinizle sizi ilişkilendirmek için kullanırız. Genel profilinize eklediğiniz herhangi bir bilgi diğer kullanıcılar tarafından görülebilir. Analiz ve platform iyileştirme için toplu, anonimleştirilmiş verileri kullanabiliriz.',
    section3: '3. Veri Depolama ve Güvenlik',
    section3Text: 'Çekirdek IP kanıtlarınız özetlenir ve orijinal dosyalar ya merkezi olmayan IPFS ağında saklanır (halka açıksa) ya da tarafımızca hiç saklanmaz (özelse). Kullanıcı profiliniz gibi zincir dışı veriler güvenli bir şekilde saklanır. Verilerin yetkisiz erişimine, kullanımına, değiştirilmesine veya imhasına karşı tüm makul önlemleri alırız.',
    section4: '4. Çerezler',
    section4Text: 'Ziyaretçileri, web sitemizi kullanımlarını ve web sitesi erişim tercihlerini belirlememize ve izlememize yardımcı olmak için çerezleri kullanırız. Tarayıcı ayarlarınız aracılığıyla çerezleri reddedebilirsiniz, ancak platformumuzun bazı özellikleri bunlar olmadan düzgün çalışmayabilir.',
    section5: '5. Seçiminiz ve Kontrolünüz',
    section5Text: 'Yalnızca cüzdan adresinizi kullanarak tamamen anonim kalmayı seçebilirsiniz. Genel bir profil oluşturmak isteğe bağlıdır. Görüntülediğiniz bilgiler üzerinde kontrol sizdedir.',
    section6: '6. Politika Değişiklikleri',
    section6Text: 'Değişikliklerin çoğu küçük olasılıkla olsa da, MindVaultIP zaman zaman Gizlilik Politikasını değiştirebilir. Ziyaretçileri herhangi bir değişiklik için bu sayfayı sık sık kontrol etmeye teşvik ediyoruz.',
  },
  bal: {
    title: 'رازداری پالیسی',
    lastUpdated: 'آخری اپڈیٹ: 21 ستمبر 2025',
    introduction: 'تئی رازداری مئے واست ءَ باز اہم اِنت. مائنڈ والٹ آئی پی ءِ تہ ءَ، مئے چند بنیادی اصول اَنت.',
    section1: '۱. آ معلومات کہ ما جمع کنیں',
    section1Text: 'وقتی کہ تئو مئے پلیٹ فارم ءَ کنکٹ بئے، ما تئی پبلک والٹ ایڈریس ءَ جمع کنیں۔ ما هچ دگہ شخصی شناختی معلومات (PII) ءَ جمع نہ کنیں مگر اینکہ تئو رضاکارانہ طور ءَ آئی ءَ وتی پبلک پروفائل ءِ تہ ءَ فراہم بکن ئے (مثلاً نام، بائیو). کل آن چین ڈیٹا، لکه ٹرانزیکشن ہیش ءُ گواهی ہیش، فطرتاً پبلک اَنت.',
    section2: '۲. ما چون معلومات ءَ کارمرزی کنیں',
    section2Text: 'ما تئی والٹ ایڈریس ءَ کارمرزی کنیں تاں تئو ءَ گوں تئی گواهی ءُ پلیٹ فارم ءِ سرا سرگرمی ءَ مرتبط بکنیں۔ هر آ معلومات کہ تئو وتی پبلک پروفائل ءَ علاوه کن ئے، دگہ کارمرزانی واست ءَ قابل دید بیت. ما شاید جمع کورتگ بوتگیں، گمنامیں ڈیٹا ءَ تجزیه و تحلیل ءُ پلیٹ فارم ءِ بہتری ءِ واست ءَ کارمرزی بکنیں۔',
    section3: '۳. ڈیٹا ءِ ذخیره سازی ءُ سیکورٹی',
    section3Text: 'تئی بنیادی آئی پی گواهی ہیش بنت، ءُ اصلی فائل یا غیرمرکزی IPFS نیٹ ورک ءِ سرا ذخیره بنت (اگر پبلک بہ بنت) یا اصلاً مئے نیمگ ءَ چہ ذخیره نہ بنت (اگر پرائیویٹ بہ بنت). آف چین ڈیٹا لکه تئی یوزر پروفائل محفوظ طور ءَ ذخیره بیت. ما ڈیٹا ءِ غیر مجاز دسترسی، کارمرزی، परिवर्तन، یا تباہی ءِ خلاف کل معقولیں اقدامات ءَ گریں۔',
    section4: '۴. کوکیز',
    section4Text: 'ما کوکیز ءَ کارمرزی کنیں تاں مارا زائرین، آیان ءِ مئے ویب سائٹ ءِ کارمرزی، ءُ آیان ءِ ویب سائٹ ءَ دسترسی ءِ ترجیحات ءِ شناخت ءُ ٹریک کنگ ءَ کمک بکنت. تئو وتی براؤزر ءِ सेटिंग्स ءِ ذریعہ کوکیز ءَ رد کُت کناں، اگرچہ مئے پلیٹ فارم ءِ بعضیں خصوصیات شاید آیان ءِ بغیر درست کار نہ بکننت.',
    section5: '۵. تئی انتخاب ءُ کنٹرول',
    section5Text: 'تئو فقط وتی والٹ ایڈریس ءِ کارمرزی ءَ گوں کاملاً گمنام منت کناں. یک پبلک پروفائل جوڑ کنگ اختیاری اِنت. تئو آ معلومات ءِ سرا کنٹرول دار ئے کہ تئو نمایش دئے ئے.',
    section6: '۶. پالیسی ءِ تہ ءَ تبدیلی',
    section6Text: 'اگرچہ گیشتریں تبدیلی شاید جزئی بہ بنت، مائنڈ والٹ آئی پی شاید وخت ءَ وخت ءَ وتی رازداری پالیسی ءَ بدل بکنت. ما زائرین ءَ حوصلہ افزائی کنیں کہ آیوک باز باز اے صفحہ ءَ هرگونه تبدیلی ءِ واست ءَ چیک بکننت.',
  }
};

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
    <p className="text-gray-300 leading-relaxed">{children}</p>
  </section>
);

export default function PrivacyPolicyPage() {
  const [language] = React.useState(localStorage.getItem('lang') || 'en');
  const t = translations[language] || translations.en;

  return (
    <div className="bg-[#0B1220] text-white" dir={['fa', 'ar', 'bal'].includes(language) ? 'rtl' : 'ltr'}>
      <div className="text-center py-16 px-4 bg-[#1a2332]/50">
        <Shield className="w-20 h-20 mx-auto text-[#00E5FF] mb-6" />
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
      </div>
    </div>
  );
}
