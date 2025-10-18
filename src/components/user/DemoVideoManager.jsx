
import React, { useState, useRef } from 'react';
import { Proof } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { UploadFile } from '@/api/integrations';
import { calculateSHA256 } from '../utils/cryptoUtils';
import { validateVideoHash } from '@/api/functions';
import { Upload, Loader2, AlertCircle, Fingerprint, BadgeCheck, XCircle } from 'lucide-react';

const translations = {
  en: {
    addVideo: 'Add Demo Video',
    uploading: 'Uploading...',
    validating: 'Validating on Blockchain...',
    uploadError: 'Upload failed. Please try again.',
    validationError: 'Validation Failed: This video has not been registered as a proof on MindVaultIP. Please register it as a new proof first before adding it as a demo.',
    genericError: 'An unexpected error occurred.',
  },
  fa: {
    addVideo: 'افزودن ویدیوی دمو',
    uploading: 'در حال بارگذاری...',
    validating: 'در حال اعتبارسنجی روی بلاکچین...',
    uploadError: 'بارگذاری ناموفق بود. لطفاً دوباره تلاش کنید.',
    validationError: 'اعتبارسنجی ناموفق: این ویدیو به عنوان یک گواهی در MindVaultIP ثبت نشده است. لطفاً ابتدا آن را به عنوان یک گواهی جدید ثبت کرده و سپس به عنوان دمو اضافه کنید.',
    genericError: 'یک خطای غیرمنتظره رخ داد.',
  },
  ar: {
    addVideo: 'إضافة فيديو تجريبي',
    uploading: 'جاري التحميل...',
    validating: 'التحقق على البلوك تشين...',
    uploadError: 'فشل التحميل. يرجى المحاولة مرة أخرى.',
    validationError: 'فشل التحقق: لم يتم تسجيل هذا الفيديو كإثبات على MindVaultIP. يرجى تسجيله كإثبات جديد أولاً قبل إضافته كعرض تجريبي.',
    genericError: 'حدث خطأ غير متوقع.',
  },
  zh: {
    addVideo: '添加演示视频',
    uploading: '上传中...',
    validating: '在区块链上验证...',
    uploadError: '上传失败。请再试一次。',
    validationError: '验证失败：此视频尚未在 MindVaultIP 上注册为证明。请先将其注册为新证明，然后再添加为演示。',
    genericError: '发生意外错误。',
  },
  hi: {
    addVideo: 'डेमो वीडियो जोड़ें',
    uploading: 'अपलोड हो रहा है...',
    validating: 'ब्लॉकचेन पर मान्य किया जा रहा है...',
    uploadError: 'अपलोड विफल। कृपया पुन: प्रयास करें।',
    validationError: 'सत्यापन विफल: यह वीडियो माइंडवॉल्टआईपी पर प्रमाण के रूप में पंजीकृत नहीं है। कृपया इसे पहले एक नए प्रमाण के रूप में पंजीकृत करें और फिर इसे डेमो के रूप में जोड़ें।',
    genericError: 'एक अप्रत्याशित त्रुटि हुई।',
  },
  ur: {
    addVideo: 'ڈیمو ویڈیو شامل کریں',
    uploading: 'اپ لوڈ ہو رہا ہے...',
    validating: 'بلاک چین پر توثیق ہو رہی ہے...',
    uploadError: 'اپ لوڈ ناکام ہوگئی۔ براہ کرم دوبارہ کوشش کریں۔',
    validationError: 'توثیق ناکام: یہ ویڈیو MindVaultIP پر ثبوت کے طور پر رجسٹرڈ نہیں ہے۔ براہ کرم پہلے اسے نئے ثبوت کے طور پر رجسٹر کریں اور پھر اسے ڈیمو کے طور پر شامل کریں۔',
    genericError: 'ایک غیر متوقع خرابی پیش آگئی۔',
  },
  de: {
    addVideo: 'Demo-Video hinzufügen',
    uploading: 'Lädt hoch...',
    validating: 'Validierung auf der Blockchain...',
    uploadError: 'Upload fehlgeschlagen. Bitte versuchen Sie es erneut.',
    validationError: 'Validierung fehlgeschlagen: Dieses Video wurde nicht als Nachweis auf MindVaultIP registriert. Bitte registrieren Sie es zuerst als neuen Nachweis, bevor Sie es als Demo hinzufügen.',
    genericError: 'Ein unerwarteter Fehler ist aufgetreten.',
  },
  fr: {
    addVideo: 'Ajouter une vidéo de démonstration',
    uploading: 'Téléchargement...',
    validating: 'Validation sur la Blockchain...',
    uploadError: 'Le téléchargement a échoué. Veuillez réessayer.',
    validationError: 'Échec de la validation : cette vidéo n\'a pas été enregistrée comme preuve sur MindVaultIP. Veuillez d\'abord l\'enregistrer comme nouvelle preuve avant de l\'ajouter en tant que démo.',
    genericError: 'Une erreur inattendue est survenue.',
  },
  es: {
    addVideo: 'Agregar video de demostración',
    uploading: 'Subiendo...',
    validating: 'Validando en la Blockchain...',
    uploadError: 'La carga falló. Por favor, inténtelo de nuevo.',
    validationError: 'Falló la validación: este video no ha sido registrado como prueba en MindVaultIP. Regístrelo como una nueva prueba antes de agregarlo como demostración.',
    genericError: 'Ocurrió un error inesperado.',
  },
  ru: {
    addVideo: 'Добавить демо-видео',
    uploading: 'Загрузка...',
    validating: 'Проверка в блокчейне...',
    uploadError: 'Загрузка не удалась. Пожалуйста, попробуйте еще раз.',
    validationError: 'Ошибка проверки: это видео не зарегистрировано как доказательство на MindVaultIP. Пожалуйста, сначала зарегистрируйте его как новое доказательство, а затем добавьте как демо.',
    genericError: 'Произошла непредвиденная ошибка.',
  },
  ja: {
    addVideo: 'デモビデオを追加',
    uploading: 'アップロード中...',
    validating: 'ブロックチェーンで検証中...',
    uploadError: 'アップロードに失敗しました。もう一度お試しください。',
    validationError: '検証に失敗しました：このビデオはMindVaultIPで証明として登録されていません。最初に新しい証明として登録してから、デモとして追加してください。',
    genericError: '予期しないエラーが発生しました。',
  },
  ko: {
    addVideo: '데모 비디오 추가',
    uploading: '업로드 중...',
    validating: '블록체인에서 확인 중...',
    uploadError: '업로드에 실패했습니다. 다시 시도하십시오.',
    validationError: '확인 실패: 이 비디오는 MindVaultIP에 증명으로 등록되지 않았습니다. 먼저 새 증명으로 등록한 다음 데모로 추가하십시오.',
    genericError: '예기치 않은 오류가 발생했습니다.',
  },
  sw: {
    addVideo: 'Ongeza Video ya Onyesho',
    uploading: 'Inapakia...',
    validating: 'Inathibitisha kwenye Blockchain...',
    uploadError: 'Upakiaji haukufaulu. Tafadhali jaribu tena.',
    validationError: 'Uthibitishaji haukufaulu: Video hii haijasajiliwa kama uthibitisho kwenye MindVaultIP. Tafadhali isajili kama uthibitisho mpya kwanza kabla ya kuiongeza kama onyesho.',
    genericError: 'Kosa lisilotarajiwa limetokea.',
  },
  ha: {
    addVideo: 'Ƙara Bidiyon Demo',
    uploading: 'Ana lodawa...',
    validating: 'Ana tabbatarwa a kan Blockchain...',
    uploadError: 'Lodawa ya gaza. Don Allah a sake gwadawa.',
    validationError: 'Tabbatarwa ta gaza: Ba a yi rijistar wannan bidiyon a matsayin hujja a kan MindVaultIP ba. Don Allah a yi rijistarsa a matsayin sabuwar hujja kafin a ƙara shi a matsayin demo.',
    genericError: 'Wani kuskuren da ba a zata ba ya faru.',
  },
  yo: {
    addVideo: 'Fi Fidio Demo kun',
    uploading: 'Ngba agberu...',
    validating: 'N ṣayẹwo lori Blockchain...',
    uploadError: 'Igbesoke kuna. Jọwọ gbiyanju lẹẹkansi.',
    validationError: 'Ijerisi kuna: Fidio yii ko ti forukọsilẹ bi ẹri lori MindVaultIP. Jọwọ kọkọ forukọsilẹ rẹ bi ẹri tuntun ṣaaju fifi kun bi demo.',
    genericError: 'Aṣiṣe airotẹlẹ kan ṣẹlẹ.',
  },
  tr: {
    addVideo: 'Demo Videosu Ekle',
    uploading: 'Yükleniyor...',
    validating: 'Blok Zincirinde Doğrulanıyor...',
    uploadError: 'Yükleme başarısız oldu. Lütfen tekrar deneyin.',
    validationError: 'Doğrulama Başarısız: Bu video MindVaultIP\'de bir kanıt olarak kaydedilmemiş. Lütfen demo olarak eklemeden önce onu yeni bir kanıt olarak kaydedin.',
    genericError: 'Beklenmedik bir hata oluştu.'
  },
  ku: {
    addVideo: 'Vîdyoya Demo Zêde Bikin',
    uploading: 'Bardibe...',
    validating: 'Li ser Blockchainê tê verastkirin...',
    uploadError: 'Barkirin bi ser neket. Ji kerema xwe dîsa biceribîne.',
    validationError: 'Verastkirin Bi Ser Neket: Ev vîdyo li ser MindVaultIP wekî delîl nehatiye tomarkirin. Ji kerema xwe pêşî wê wekî delîlek nû tomar bikin û paşê wê wekî demo zêde bikin.',
    genericError: 'Çewtiyek nediyar çêbû.',
  },
  ps: {
    addVideo: 'ډیمو ویډیو اضافه کړئ',
    uploading: 'اپلوډ کیږي...',
    validating: 'په بلاکچین کې تایید کیږي...',
    uploadError: 'اپلوډ ناکام شو. مهرباني وکړئ بیا هڅه وکړئ.',
    validationError: 'تایید ناکام شو: دا ویډیو په MindVaultIP کې د ثبوت په توګه نده ثبت شوې. مهرباني وکړئ لومړی یې د نوي ثبوت په توګه ثبت کړئ او بیا یې د ډیمو په توګه اضافه کړئ.',
    genericError: 'یوه ناڅاپي تېروتنه وشوه.',
  }
};

export default function DemoVideoManager({ proof, onVideoUpdated }) {
  const [status, setStatus] = useState('idle'); // 'idle', 'validating', 'uploading', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [language] = useState(localStorage.getItem('lang') || 'en');
  const fileInputRef = useRef(null);
  const t = translations[language] || translations.en;

  const handleButtonClick = () => {
    setErrorMessage('');
    setStatus('idle');
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus('validating');
    setErrorMessage('');

    try {
      // 1. Calculate hash
      const hash = await calculateSHA256(file);

      // 2. Validate hash with backend function
      const { data: validationResponse, error: validationError } = await validateVideoHash({ hash });

      if (validationError || !validationResponse) {
          throw new Error('Validation service failed.');
      }
      
      if (!validationResponse.isValid) {
        setErrorMessage(t.validationError);
        setStatus('error');
        return;
      }

      // 3. If valid, proceed to upload
      setStatus('uploading');
      const { file_url } = await UploadFile({ file });

      // 4. Update the proof with the new demo video URL
      const currentVideos = proof.demo_videos || [];
      const newVideos = [...currentVideos, file_url];
      await Proof.update(proof.id, { demo_videos: newVideos });
      onVideoUpdated(proof.id, newVideos);
      setStatus('idle');

    } catch (error) {
      console.error("Video processing failed:", error);
      if (!errorMessage) { // Avoid overwriting specific validation error
        setErrorMessage(error.message || t.genericError);
      }
      setStatus('error');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const isProcessing = status === 'uploading' || status === 'validating';

  const getButtonContent = () => {
    if (status === 'validating') {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t.validating}
        </>
      );
    }
    if (status === 'uploading') {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t.uploading}
        </>
      );
    }
    return (
      <>
        <Upload className="mr-2 h-4 w-4" />
        {t.addVideo}
      </>
    );
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        accept="video/*"
        disabled={isProcessing}
      />
      <Button
        variant="outline"
        className="border-dashed border-gray-500 text-gray-300 w-full"
        onClick={handleButtonClick}
        disabled={isProcessing}
      >
        {getButtonContent()}
      </Button>
      {status === 'error' && (
        <div className="text-red-500 text-sm mt-2 flex items-start gap-2 bg-red-500/10 p-3 rounded-md">
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5"/>
            <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
