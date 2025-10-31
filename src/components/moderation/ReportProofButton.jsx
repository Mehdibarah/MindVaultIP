
import React, { useState, useEffect } from 'react';
// Reporting disabled - Base44 removed, Supabase reports table not yet implemented
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Flag, Loader2 } from 'lucide-react';

const translations = {
  en: {
    reportProof: 'Report Proof',
    reportTitle: 'Report Proof',
    reportDesc: 'If you believe this proof violates platform rules, please submit a report. All reports are reviewed by moderators.',
    reason: 'Reason',
    selectReason: 'Select a reason...',
    spam: 'Spam or Misleading',
    inappropriate: 'Inappropriate Content',
    copyright: 'Copyright Infringement',
    fraud: 'Fraud or Scam',
    other: 'Other',
    details: 'Details (Optional)',
    detailsPlaceholder: 'Provide more information...',
    submit: 'Submit Report',
    cancel: 'Cancel',
    submitting: 'Submitting...',
    success: 'Report submitted successfully. Thank you for helping keep the platform safe.',
    error: 'Failed to submit report. Please try again.',
    connectToReport: 'Connect wallet to report',
  },
  fa: {
    reportProof: 'گزارش گواهی',
    reportTitle: 'گزارش گواهی',
    reportDesc: 'اگر معتقدید این گواهی قوانین پلتفرم را نقض می‌کند، لطفاً یک گزارش ارسال کنید. تمام گزارش‌ها توسط مدیران بررسی می‌شوند.',
    reason: 'دلیل',
    selectReason: 'یک دلیل انتخاب کنید...',
    spam: 'هرزنامه یا گمراه‌کننده',
    inappropriate: 'محتوای نامناسب',
    copyright: 'نقض کپی‌رایت',
    fraud: 'کلاهبرداری یا تقلب',
    other: 'سایر',
    details: 'جزئیات (اختیاری)',
    detailsPlaceholder: 'اطلاعات بیشتری ارائه دهید...',
    submit: 'ارسال گزارش',
    cancel: 'لغو',
    submitting: 'در حال ارسال...',
    success: 'گزارش با موفقیت ارسال شد. از اینکه به حفظ امنیت پلتفرم کمک کردید متشکریم.',
    error: 'ارسال گزارش ناموفق بود. لطفاً دوباره تلاش کنید.',
    connectToReport: 'برای گزارش، کیف پول را متصل کنید',
  },
};

export default function ReportProofButton({ proofId }) {
  const [address, setAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    const handleLanguageChange = () => setLanguage(localStorage.getItem('lang') || 'en');
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);
  
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      setAddress(accounts[0] || null);
    };

    window.ethereum.request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch(console.error);

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const t = translations[language] || translations.en;
  const isConnected = !!address;

  const handleSubmit = async () => {
    if (!reason || !isConnected || !address) return;
    setIsLoading(true);
    try {
      // Reporting feature disabled - Base44 removed
      // TODO: Implement reporting using Supabase reports table
      console.warn('Reporting not yet implemented with Supabase');
      throw new Error('Reporting feature not yet available');
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert(t.error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
        <Button variant="destructive_outline" className="w-full" disabled>
            <Flag className="w-4 h-4 mr-2" />
            {t.connectToReport}
        </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive_outline" className="w-full">
          <Flag className="w-4 h-4 mr-2" />
          {t.reportProof}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a2332] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{t.reportTitle}</DialogTitle>
          <DialogDescription>{t.reportDesc}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div>
                <label className="text-sm font-medium">{t.reason}</label>
                <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger className="bg-[#0B1220] border-gray-600 mt-2">
                        <SelectValue placeholder={t.selectReason} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="spam">{t.spam}</SelectItem>
                        <SelectItem value="inappropriate">{t.inappropriate}</SelectItem>
                        <SelectItem value="copyright">{t.copyright}</SelectItem>
                        <SelectItem value="fraud">{t.fraud}</SelectItem>
                        <SelectItem value="other">{t.other}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="text-sm font-medium">{t.details}</label>
                <Textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={t.detailsPlaceholder}
                    className="bg-[#0B1220] border-gray-600 mt-2"
                />
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>{t.cancel}</Button>
          <Button onClick={handleSubmit} disabled={!reason || isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
            {isLoading ? t.submitting : t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
