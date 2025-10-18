
import React, { useState, useEffect, useCallback } from 'react';
import { ExpertApplication } from '@/api/entities';
import { User } from '@/api/entities'; // Keeping User import as it was present in the original file and not explicitly removed by the outline.
import { useWallet } from '../components/wallet/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Keeping Card components as they were in original imports, even if not used in the new JSX structure.
import { motion } from 'framer-motion';
import { UserCheck, CheckCircle } from 'lucide-react'; // Added UserCheck and CheckCircle icons as used in the new component structure.

const translations = {
    en: {
        title: 'Become a MindVaultIP Expert', // Updated title as per outline
        subtitle: 'Your knowledge can shape the future of innovation. Join our panel to review new inventions and earn rewards.',
        formTitle: 'Expert Application Form',
        fullName: 'Full Name',
        email: 'Contact Email',
        fieldOfExpertise: 'Primary Field of Expertise',
        selectField: 'Select your primary field',
        technology: 'Technology',
        biotech: 'Biotechnology',
        mechanical: 'Mechanical Engineering',
        chemistry: 'Chemistry',
        physics: 'Physics',
        software: 'Software',
        ai: 'Artificial Intelligence',
        blockchain: 'Blockchain',
        design: 'Design',
        other: 'Other',
        experience: 'Years of Professional Experience',
        motivation: 'Why do you want to be an expert?',
        motivationPlaceholder: 'Describe your motivation and how you can contribute...',
        portfolio: 'Portfolio/LinkedIn Link (Optional)',
        submit: 'Submit Application',
        submitting: 'Submitting...',
        applicationSent: 'Application Sent!',
        applicationSentDesc: 'Thank you for applying. Our team will review your application and get back to you via email.',
        goDashboard: 'Go to Dashboard',
        connectWallet: 'Please connect your wallet first.'
    },
    fa: {
        title: 'به یک متخصص پلتفرم تبدیل شوید',
        subtitle: 'دانش شما می‌تواند آینده نوآوری را شکل دهد. به پنل ما بپیوندید تا اختراعات جدید را بررسی کرده و پاداش کسب کنید.',
        formTitle: 'فرم درخواست کارشناسی',
        fullName: 'نام کامل',
        email: 'ایمیل تماس',
        fieldOfExpertise: 'حوزه اصلی تخصص',
        selectField: 'حوزه اصلی خود را انتخاب کنید',
        technology: 'فناوری',
        biotech: 'بیوتکنولوژی',
        mechanical: 'مهندسی مکانیک',
        chemistry: 'شیمی',
        physics: 'فیزیک',
        software: 'نرم‌افزار',
        ai: 'هوش مصنوعی',
        blockchain: 'بلاکچین',
        design: 'طراحی',
        other: 'سایر',
        experience: 'سال‌های تجربه حرفه‌ای',
        motivation: 'چرا می‌خواهید یک متخصص باشید؟',
        motivationPlaceholder: 'انگیزه خود و نحوه مشارکت خود را شرح دهید...',
        portfolio: 'لینک نمونه‌کار/لینکدین (اختیاری)',
        submit: 'ارسال درخواست',
        submitting: 'در حال ارسال...',
        applicationSent: 'درخواست ارسال شد!',
        applicationSentDesc: 'از درخواست شما متشکریم. تیم ما درخواست شما را بررسی کرده و از طریق ایمیل با شما تماس خواهد گرفت.',
        goDashboard: 'رفتن به داشبورد',
        connectWallet: 'لطفاً ابتدا کیف پول خود را متصل کنید.'
    },
    ar: {
        title: 'كن خبيرًا في المنصة',
        subtitle: 'يمكن لمعرفتك أن تشكل مستقبل الابتكار. انضم إلى لجنتنا لمراجعة الاختراعات الجديدة وكسب المكافآت.',
        formTitle: 'نموذج طلب خبير',
        fullName: 'الاسم الكامل',
        email: 'بريد الاتصال الإلكتروني',
        fieldOfExpertise: 'مجال الخبرة الرئيسي',
        selectField: 'اختر مجالك الأساسي',
        technology: 'التكنولوجيا',
        biotech: 'التكنولوجيا الحيوية',
        mechanical: 'الهندسة الميكانيكية',
        chemistry: 'الكيمياء',
        physics: 'الفيزياء',
        software: 'البرمجيات',
        ai: 'الذكاء الاصطناعي',
        blockchain: 'البلوك تشين',
        design: 'التصميم',
        other: 'أخرى',
        experience: 'سنوات الخبرة المهنية',
        motivation: 'لماذا تريد أن تكون خبيرًا؟',
        motivationPlaceholder: 'صف دافعك وكيف يمكنك المساهمة...',
        portfolio: 'رابط ملف الأعمال/لينكدإن (اختياري)',
        submit: 'إرسال الطلب',
        submitting: 'جارٍ الإرسال...',
        applicationSent: 'تم إرسال الطلب!',
        applicationSentDesc: 'شكرًا لك على التقديم. سيقوم فريقنا بمراجعة طلبك والرد عليك عبر البريد الإلكتروني.',
        goDashboard: 'اذهب إلى لوحة التحكم',
        connectWallet: 'الرجاء توصيل محفظتك أولاً.'
    },
    tr: {
        title: 'Uzman Olarak Başvur',
        subtitle: 'Uzman inceleme panelimize katılın ve platformun bütünlüğünü sağlamaya yardımcı olun.',
        formTitle: 'Uzman Başvuru Formu',
        fullName: 'Tam Ad',
        email: 'E-posta',
        fieldOfExpertise: 'Uzmanlık Alanı',
        selectField: 'Ana alanınızı seçin',
        technology: 'Teknoloji',
        biotech: 'Biyoteknoloji',
        mechanical: 'Makine Mühendisliği',
        chemistry: 'Kimya',
        physics: 'Fizik',
        software: 'Yazılım',
        ai: 'Yapay Zeka',
        blockchain: 'Blok Zinciri',
        design: 'Tasarım',
        other: 'Diğer',
        experience: 'Deneyim Yılı',
        motivation: 'Motivasyon Mektubu',
        motivationPlaceholder: 'Neden uzman olmak istiyorsunuz?',
        portfolio: 'Portföy/LinkedIn Linki (İsteğe Bağlı)',
        submit: 'Başvuruyu Gönder',
        submitting: 'Gönderiliyor...',
        applicationSent: 'Başvuru Gönderildi!',
        applicationSentDesc: 'Başvurunuz için teşekkür ederiz. Ekibimiz başvurunuzu inceleyecek ve sizinle e-posta yoluyla iletişime geçecektir.',
        goDashboard: 'Kontrol Paneline Git',
        connectWallet: 'Lütfen önce cüzdanınızı bağlayın.'
    },
    de: { // Added German translations
        title: 'Werden Sie ein MindVaultIP-Experte',
        subtitle: 'Treten Sie unserem Gremium bei, um Erfindungen zu validieren und Belohnungen zu verdienen.',
        formTitle: 'Experten-Bewerbungsformular',
        fullName: 'Vollständiger Name',
        email: 'E-Mail-Adresse',
        fieldOfExpertise: 'Fachgebiet',
        selectField: 'Wählen Sie Ihr Hauptgebiet',
        technology: 'Technologie',
        biotech: 'Biotechnologie',
        mechanical: 'Maschinenbau',
        chemistry: 'Chemie',
        physics: 'Physik',
        software: 'Software',
        ai: 'Künstliche Intelligenz',
        blockchain: 'Blockchain',
        design: 'Design',
        other: 'Andere',
        experience: 'Berufserfahrung (Jahre)',
        motivation: 'Motivation',
        motivationPlaceholder: 'Warum möchten Sie ein Experte auf dieser Plattform sein?',
        portfolio: 'Portfolio/LinkedIn-Link (Optional)',
        submit: 'Bewerbung einreichen',
        submitting: 'Wird eingereicht...',
        applicationSent: 'Bewerbung eingegangen!', // Mapped from 'successTitle' in outline
        applicationSentDesc: 'Vielen Dank für Ihre Bewerbung. Unser Team wird sie prüfen und sich bei Ihnen melden.', // Mapped from 'successMessage' in outline
        goDashboard: 'Zum Dashboard gehen',
        connectWallet: 'Bitte verbinden Sie zuerst Ihre Wallet.' // Added for consistency
    },
    bal: {
        title: 'مائنڈ والٹ آئی پی ءِ ماہر جوڑ بئے',
        subtitle: 'ایجادات ءِ تصدیق کنگ ءُ انعامات حاصل کنگ ءِ واست ءَ مئے پینل ءَ ہوار بئے.',
        formTitle: 'ماہر ءِ درخواست ءِ فارم',
        fullName: 'پورا نام',
        email: 'ای میل ایڈریس',
        fieldOfExpertise: 'مہارت ءِ فیلڈ',
        selectField: 'وتی اصلی فیلڈ ءَ انتخاب کن',
        technology: 'ٹیکنالوجی',
        biotech: 'بایوٹیک',
        mechanical: 'مکینیکل',
        chemistry: 'کیمسٹری',
        physics: 'فزکس',
        software: 'سافٹ ویئر',
        ai: 'مصنوعی ذہانت',
        blockchain: 'بلاکچین',
        design: 'ڈیزائن',
        other: 'دگہ',
        experience: 'پیشہ ورانہ تجربہ (سال)',
        motivation: 'حوصلہ افزائی',
        motivationPlaceholder: 'تئو چیا اے پلیٹ فارم ءِ سرا یک ماہر جوڑ بیئگ لوٹ ئے؟',
        portfolio: 'پورٹ فولیو/لنکڈ ان ءِ لنک (اختیاری)',
        submit: 'درخواست جمع کن',
        submitting: 'جمع کنگ ءَ اِنت...',
        applicationSent: 'درخواست وصول بوت!',
        applicationSentDesc: 'تئی درخواست ءِ واست ءَ منت واراں. مئے ٹیم آئی ءَ جائزہ گریت ءُ تئو گوں رابطہ کنت.',
        goDashboard: 'ڈیش بورڈ ءَ برو',
        connectWallet: 'لطفاً ابتداً وتی پرس ءَ کنیکٹ کن.'
    }
};

export default function ApplyExpertPage() {
    const { address, isConnected } = useWallet();
    const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        fieldOfExpertise: '',
        experience: '',
        motivation: '',
        portfolio: '' // New field for portfolio link
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handleLanguageChange = () => setLanguage(localStorage.getItem('lang') || 'en');
        window.addEventListener('languageChange', handleLanguageChange);
        return () => window.removeEventListener('languageChange', handleLanguageChange);
    }, []);

    const t = translations[language] || translations.en;
    const isRTL = ['fa', 'ar', 'bal'].includes(language); // Added 'bal' to RTL languages

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConnected || !address) {
            alert(t.connectWallet);
            return;
        }

        setIsSubmitting(true);
        try {
            const appData = {
                applicant_wallet: address,
                full_name: formData.fullName,
                email: formData.email,
                field_of_expertise: formData.fieldOfExpertise,
                experience_years: parseInt(formData.experience, 10) || 0,
                motivation_statement: formData.motivation,
                portfolio_link: formData.portfolio, // Include new portfolio link
                application_status: 'pending'
            };
            
            await ExpertApplication.create(appData);
            setIsSubmitted(true);
            setFormData({ 
                fullName: '', 
                email: '', 
                fieldOfExpertise: '', 
                experience: '', 
                motivation: '', 
                portfolio: '' 
            }); // Clear new field

        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-8 bg-[#0B1220] min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-3xl mx-auto">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <UserCheck className="w-16 h-16 text-[#00E5FF] mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-white mb-2">{t.title}</h1>
                    <p className="text-gray-400 max-w-xl mx-auto">{t.subtitle}</p>
                </motion.div>
                
                {isSubmitted ? (
                    <motion.div 
                        className="glow-card p-6 md:p-8 rounded-2xl text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">{t.applicationSent}</h2>
                        <p className="text-gray-300 mb-6">{t.applicationSentDesc}</p>
                        <Button 
                            onClick={() => window.location.href = '/dashboard'}
                            className="glow-button text-white font-semibold"
                        >
                            {t.goDashboard}
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div 
                        className="glow-card p-6 md:p-8 rounded-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">{t.formTitle}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="fullName" className="block text-gray-300 text-sm font-bold mb-2">
                                    {t.fullName}
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
                                    {t.email}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="fieldOfExpertise" className="block text-gray-300 text-sm font-bold mb-2">
                                    {t.fieldOfExpertise}
                                </label>
                                <select
                                    id="fieldOfExpertise"
                                    name="fieldOfExpertise"
                                    value={formData.fieldOfExpertise}
                                    onChange={handleChange}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white"
                                >
                                    <option value="" disabled>{t.selectField}</option>
                                    <option value="technology">{t.technology}</option>
                                    <option value="biotech">{t.biotech}</option>
                                    <option value="mechanical">{t.mechanical}</option>
                                    <option value="chemistry">{t.chemistry}</option>
                                    <option value="physics">{t.physics}</option>
                                    <option value="software">{t.software}</option>
                                    <option value="ai">{t.ai}</option>
                                    <option value="blockchain">{t.blockchain}</option>
                                    <option value="design">{t.design}</option>
                                    <option value="other">{t.other}</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="experience" className="block text-gray-300 text-sm font-bold mb-2">
                                    {t.experience}
                                </label>
                                <input
                                    type="number"
                                    id="experience"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="motivation" className="block text-gray-300 text-sm font-bold mb-2">
                                    {t.motivation}
                                </label>
                                <textarea
                                    id="motivation"
                                    name="motivation"
                                    value={formData.motivation}
                                    onChange={handleChange}
                                    placeholder={t.motivationPlaceholder}
                                    rows="5"
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="portfolio" className="block text-gray-300 text-sm font-bold mb-2">
                                    {t.portfolio}
                                </label>
                                <input
                                    type="url"
                                    id="portfolio"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                    placeholder="e.g., https://linkedin.com/in/yourprofile"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 text-white"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full glow-button text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={isSubmitting || !isConnected}
                            >
                                {isSubmitting ? t.submitting : t.submit}
                            </Button>
                            {!isConnected && <p className="text-red-400 text-sm mt-4 text-center">{t.connectWallet}</p>}
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
