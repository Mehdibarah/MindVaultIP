
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, CheckCircle, DollarSign, FileText } from 'lucide-react';

const translations = {
  en: {
    totalProofs: 'Total Proofs',
    approvedProofs: 'Approved Proofs',
    approvalRate: 'Approval Rate',
    proofsSold: 'Proofs Sold',
  },
  fa: {
    totalProofs: 'تعداد کل گواهی‌ها',
    approvedProofs: 'گواهی‌های تایید شده',
    approvalRate: 'نرخ تایید',
    proofsSold: 'گواهی‌های فروخته شده',
  },
  ar: {
    totalProofs: 'إجمالي الإثباتات',
    approvedProofs: 'الإثباتات المعتمدة',
    approvalRate: 'معدل الموافقة',
    proofsSold: 'الإثباتات المباعة',
  },
  zh: {
    totalProofs: '总证明数',
    approvedProofs: '已批准证明',
    approvalRate: '批准率',
    proofsSold: '已售出证明',
  },
  hi: {
    totalProofs: 'कुल प्रमाण',
    approvedProofs: 'स्वीकृत प्रमाण',
    approvalRate: 'स्वीकृति दर',
    proofsSold: 'बेचे गए प्रमाण',
  },
  ur: {
    totalProofs: 'کل ثبوت',
    approvedProofs: 'منظور شدہ ثبوت',
    approvalRate: 'منظوری کی شرح',
    proofsSold: 'فروخت شدہ ثبوت',
  },
  de: {
    totalProofs: 'Gesamte Nachweise',
    approvedProofs: 'Genehmigte Nachweise',
    approvalRate: 'Genehmigungsrate',
    proofsSold: 'Verkaufte Nachweise',
  },
  fr: {
    totalProofs: 'Total des Preuves',
    approvedProofs: 'Preuves Approuvées',
    approvalRate: 'Taux d\'approbation',
    proofsSold: 'Preuves Vendues',
  },
  es: {
    totalProofs: 'Total de Pruebas',
    approvedProofs: 'Pruebas Aprobadas',
    approvalRate: 'Tasa de Aprobación',
    proofsSold: 'Pruebas Vendidas',
  },
  ru: {
    totalProofs: 'Всего доказательств',
    approvedProofs: 'Одобренные доказательства',
    approvalRate: 'Процент одобрения',
    proofsSold: 'Проданные доказательства',
  },
  ja: {
    totalProofs: '総証明数',
    approvedProofs: '承認済み証明',
    approvalRate: '承認率',
    proofsSold: '販売済み証明',
  },
  ko: {
    totalProofs: '총 증명',
    approvedProofs: '승인된 증명',
    approvalRate: '승인율',
    proofsSold: '판매된 증명',
  },
  sw: {
    totalProofs: 'Jumla ya Uthibitisho',
    approvedProofs: 'Uthibitisho Uliokubaliwa',
    approvalRate: 'Kiwango cha Uidhinishaji',
    proofsSold: 'Uthibitisho Uliouzwa',
  },
  ha: {
    totalProofs: 'Jimlar Tabbaci',
    approvedProofs: 'Tabbacin da aka Amince',
    approvalRate: 'Adadin Amincewa',
    proofsSold: 'Tabbacin da aka Siyar',
  },
  yo: {
    totalProofs: 'Lapapọ Awọn Ẹri',
    approvedProofs: 'Awọn Ẹri ti a fọwọsi',
    approvalRate: 'Oṣuwọn Ifọwọsi',
    proofsSold: 'Awọn Ẹri ti a Ta',
  },
  tr: {
    totalProofs: 'Toplam Kanıt',
    approvedProofs: 'Onaylanmış Kanıtlar',
    approvalRate: 'Onay Oranı',
    proofsSold: 'Satılan Kanıtlar',
  },
  ku: {
    totalProofs: 'Tevahiya Delîlan',
    approvedProofs: 'Delîlên Pejirandî',
    approvalRate: 'Rêjeya Pejirandinê',
    proofsSold: 'Delîlên Firotî',
  },
  ps: {
    totalProofs: 'ټول ثبوتونه',
    approvedProofs: 'منل شوي ثبوتونه',
    approvalRate: 'د منلو کچه',
    proofsSold: 'پلورل شوي ثبوتونه',
  },
  bal: {
    totalProofs: 'کل گواهی',
    approvedProofs: 'منظور بوتگیں گواهی',
    approvalRate: 'منظوری ءِ شرح',
    proofsSold: 'بہا بوتگیں گواهی',
  }
};

export default function DashboardStats({ proofs }) {
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
  
  const totalProofs = proofs.length;
  const approvedProofs = proofs.filter(p => p.validation_status === 'ai_approved').length;
  const approvalRate = totalProofs > 0 ? ((approvedProofs / totalProofs) * 100).toFixed(0) : 0;
  
  // This logic is a simplification. A real "sold" status would be better.
  const totalSold = proofs.filter(p => !p.is_for_sale && p.owner_wallet_address !== p.created_by).length; 

  const t = translations[language] || translations.en;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="glow-card-blue p-4">
        <CardContent className="flex flex-col items-center justify-center p-0">
          <FileText className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold">{totalProofs}</p>
          <p className="text-sm text-gray-400">{t.totalProofs}</p>
        </CardContent>
      </Card>
      <Card className="glow-card-blue p-4">
        <CardContent className="flex flex-col items-center justify-center p-0">
          <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold">{approvedProofs}</p>
          <p className="text-sm text-gray-400">{t.approvedProofs}</p>
        </CardContent>
      </Card>
      <Card className="glow-card-blue p-4">
        <CardContent className="flex flex-col items-center justify-center p-0">
          <Award className="w-8 h-8 text-yellow-400 mb-2" />
          <p className="text-2xl font-bold">{approvalRate}%</p>
          <p className="text-sm text-gray-400">{t.approvalRate}</p>
        </CardContent>
      </Card>
      <Card className="glow-card-blue p-4">
        <CardContent className="flex flex-col items-center justify-center p-0">
          <DollarSign className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-2xl font-bold">{totalSold}</p>
          <p className="text-sm text-gray-400">{t.proofsSold}</p>
        </CardContent>
      </Card>
    </div>
  );
}
