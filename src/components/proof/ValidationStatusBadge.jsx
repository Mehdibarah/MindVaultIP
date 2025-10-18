
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Bot, Award, UserCheck } from 'lucide-react';

const ValidationStatusBadge = ({ status, language }) => {
  const translations = {
    en: {
      pending_ai_review: 'Pending AI Review',
      ai_approved: 'AI Approved',
      ai_rejected: 'AI Rejected',
      pending_expert_review: 'Pending Expert Review',
      expert_approved: 'Expert Approved',
      expert_rejected: 'Expert Rejected',
      registered: 'Registered',
    },
    fa: {
      pending_ai_review: 'در انتظار بررسی AI',
      ai_approved: 'تأیید شده توسط AI',
      ai_rejected: 'رد شده توسط AI',
      pending_expert_review: 'در انتظار بررسی متخصص',
      expert_approved: 'تأیید شده توسط متخصص',
      expert_rejected: 'رد شده توسط متخصص',
      registered: 'ثبت شده',
    },
    ar: {
      pending_ai_review: 'في انتظار مراجعة الذكاء الاصطناعي',
      ai_approved: 'موافق عليه من الذكاء الاصطناعي',
      ai_rejected: 'مرفوض من الذكاء الاصطناعي',
      pending_expert_review: 'في انتظار مراجعة الخبراء',
      expert_approved: 'موافق عليه من الخبراء',
      expert_rejected: 'مرفوض من الخبراء',
      registered: 'مسجل',
    },
    zh: {
      pending_ai_review: '等待AI审核',
      ai_approved: 'AI已批准',
      ai_rejected: 'AI已拒绝',
      pending_expert_review: '等待专家审核',
      expert_approved: '专家已批准',
      expert_rejected: '专家已拒绝',
      registered: '已注册',
    },
    hi: {
      pending_ai_review: 'एआई समीक्षा लंबित',
      ai_approved: 'एआई द्वारा अनुमोदित',
      ai_rejected: 'एआई द्वारा अस्वीकृत',
      pending_expert_review: 'विशेषज्ञ समीक्षा लंबित',
      expert_approved: 'विशेषज्ञ द्वारा अनुमोदित',
      expert_rejected: 'विशेषज्ञ द्वारा अस्वीकृत',
      registered: 'पंजीकृत',
    },
    ur: {
      pending_ai_review: 'AI جائزے کا انتظار ہے',
      ai_approved: 'AI سے منظور شدہ',
      ai_rejected: 'AI سے مسترد شدہ',
      pending_expert_review: 'ماہرین کے جائزے کا انتظار ہے',
      expert_approved: 'ماہرین سے منظور شدہ',
      expert_rejected: 'ماہرین سے مسترد شدہ',
      registered: 'رجسٹرڈ',
    },
    de: {
      pending_ai_review: 'KI-Überprüfung ausstehend',
      ai_approved: 'KI-genehmigt',
      ai_rejected: 'KI-abgelehnt',
      pending_expert_review: 'Expertenüberprüfung ausstehend',
      expert_approved: 'Experten-genehmigt',
      expert_rejected: 'Experten-abgelehnt',
      registered: 'Registriert',
    },
    fr: {
      pending_ai_review: 'En attente d\'examen par l\'IA',
      ai_approved: 'Approuvé par l\'IA',
      ai_rejected: 'Rejeté par l\'IA',
      pending_expert_review: 'En attente d\'examen par un expert',
      expert_approved: 'Approuvé par un expert',
      expert_rejected: 'Rejeté par un expert',
      registered: 'Enregistré',
    },
    es: {
      pending_ai_review: 'Pendiente de revisión por IA',
      ai_approved: 'Aprobado por IA',
      ai_rejected: 'Rechazado por IA',
      pending_expert_review: 'Pendiente de revisión por experto',
      expert_approved: 'Aprobado por experto',
      expert_rejected: 'Rechazado por experto',
      registered: 'Registrado',
    },
    ru: {
      pending_ai_review: 'Ожидается проверка ИИ',
      ai_approved: 'Одобрено ИИ',
      ai_rejected: 'Отклонено ИИ',
      pending_expert_review: 'Ожидается проверка экспертом',
      expert_approved: 'Одобрено экспертом',
      expert_rejected: 'Отклонено экспертом',
      registered: 'Зарегистрировано',
    },
    ja: {
      pending_ai_review: 'AIレビュー待ち',
      ai_approved: 'AI承認済み',
      ai_rejected: 'AI却下済み',
      pending_expert_review: '専門家レビュー待ち',
      expert_approved: '専門家承認済み',
      expert_rejected: '専門家却下済み',
      registered: '登録済み',
    },
    ko: {
      pending_ai_review: 'AI 검토 대기 중',
      ai_approved: 'AI 승인됨',
      ai_rejected: 'AI 거부됨',
      pending_expert_review: '전문가 검토 대기 중',
      expert_approved: '전문가 승인됨',
      expert_rejected: '전문가 거부됨',
      registered: '등록됨',
    },
    sw: {
      pending_ai_review: 'Inasubiri Ukaguzi wa AI',
      ai_approved: 'Imeidhinishwa na AI',
      ai_rejected: 'Imekataliwa na AI',
      pending_expert_review: 'Inasubiri Ukaguzi wa Mtaalamu',
      expert_approved: 'Imeidhinishwa na Mtaalamu',
      expert_rejected: 'Imekataliwa na Mtaalamu',
      registered: 'Imesajiliwa',
    },
    ha: {
      pending_ai_review: 'Ana jiran Bita na AI',
      ai_approved: 'AI ta Amince',
      ai_rejected: 'AI ta Ƙi',
      pending_expert_review: 'Ana jiran Bita na Kwararre',
      expert_approved: 'Kwararre ya Amince',
      expert_rejected: 'Kwararre ya Ƙi',
      registered: 'An Yi Rajista',
    },
    yo: {
      pending_ai_review: 'Nduro fun Atunwo AI',
      ai_approved: 'AI Ti Fọwọsi',
      ai_rejected: 'AI Ti Kọ',
      pending_expert_review: 'Nduro fun Atunwo Onimọ',
      expert_approved: 'Onimọ Ti Fọwọsi',
      expert_rejected: 'Onimọ Ti Kọ',
      registered: 'Forukọsilẹ',
    },
    tr: {
      pending_ai_review: 'Yapay Zeka İncelemesi Bekleniyor',
      ai_approved: 'Yapay Zeka Onayladı',
      ai_rejected: 'Yapay Zeka Reddetti',
      pending_expert_review: 'Uzman İncelemesi Bekleniyor',
      expert_approved: 'Uzman Onayladı',
      expert_rejected: 'Uzman Reddetti',
      registered: 'Kayıtlı',
    },
    ku: {
      pending_ai_review: 'Li benda Nirxandina AI',
      ai_approved: 'AI Pejirand',
      ai_rejected: 'AI Red Kir',
      pending_expert_review: 'Li benda Nirxandina Pispor',
      expert_approved: 'Pispor Pejirand',
      expert_rejected: 'Pispor Red Kir',
      registered: 'Tomarkirî',
    },
    ps: {
      pending_ai_review: 'د AI بیاکتنې ته په تمه',
      ai_approved: 'AI تصویب کړ',
      ai_rejected: 'AI رد کړ',
      pending_expert_review: 'د متخصص بیاکتنې ته په تمه',
      expert_approved: 'متخصص تصویب کړ',
      expert_rejected: 'متخصص رد کړ',
      registered: 'ثبت شوی',
    }
  };

  const t = translations[language] || translations.en;

  const statusConfig = {
    pending_ai_review: {
      icon: <Bot className="w-3 h-3" />,
      label: t.pending_ai_review,
      className: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    ai_approved: {
      icon: <CheckCircle className="w-3 h-3" />,
      label: t.ai_approved,
      className: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    ai_rejected: {
      icon: <XCircle className="w-3 h-3" />,
      label: t.ai_rejected,
      className: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    pending_expert_review: {
      icon: <UserCheck className="w-3 h-3" />,
      label: t.pending_expert_review,
      className: 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse'
    },
    expert_approved: {
      icon: <Award className="w-3 h-3" />,
      label: t.expert_approved,
      className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    },
    expert_rejected: {
      icon: <XCircle className="w-3 h-3" />,
      label: t.expert_rejected,
      className: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    registered: {
      icon: <CheckCircle className="w-3 h-3" />,
      label: t.registered,
      className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  };

  const config = statusConfig[status] || statusConfig.registered;

  return (
    <Badge className={`flex items-center gap-1.5 text-xs font-medium ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default ValidationStatusBadge;
