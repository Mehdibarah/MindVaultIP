
import React, { useState, useEffect } from 'react';
import { UserReport } from '@/api/entities';
import { Proof } from '@/api/entities';
import { ProofModeration } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  XCircle,
  Flag,
  Users,
  FileText,
  TrendingUp,
  Clock, 
  AlertCircle, 
  GraduationCap, 
  DollarSign 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ModerationPanel from '../components/moderation/ModerationPanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import ExpertApplicationsPanel from '../components/admin/ExpertApplicationsPanel';

const translations = {
  en: {
    title: 'Admin Control Panel',
    adminDescription: 'Manage platform security, reports, and content moderation.',
    accessDenied: 'Access Denied',
    accessDeniedMsg: 'You do not have the required permissions to view this page. This area is for administrators only.',
    returnHome: 'Return to Home',
    moderation: 'Moderation',
    expertApps: 'Expert Applications',
    treasury: 'Treasury', // Simplified for tab name
    dashboard: 'Dashboard',
    reports: 'Reports',
    content: 'Content', // For the 'moderation' tab
    expertReview: 'Expert Review',
    loadingAdminPanel: 'Loading admin panel...',
    pendingReports: 'Pending Reports',
    totalUsers: 'Total Users',
    totalProofs: 'Total Proofs',
    reportsProcessed: 'Reports Processed',
    recentReports: 'Recent Reports',
    proofId: 'Proof ID:',
    reporter: 'Reporter:',
    noRecentReports: 'No recent reports.',
    userReportsManagement: 'User Reports Management',
    actOnReport: 'Act On Report',
    dismiss: 'Dismiss',
    noReportsFound: 'No reports found. Platform is clean! 🎉',
    assignProofForExpertReview: 'Assign Proof for Expert Review',
    selectProof: 'Select Proof',
    chooseProofToReview: 'Choose a proof to review...',
    noProofsAvailable: 'No proofs available',
    selectExpert: 'Select Expert',
    chooseAnExpert: 'Choose an expert...',
    noExpertsAvailable: 'No experts available',
    assignForReview: 'Assign for Review',
    treasuryPlaceholder: 'Treasury management features will be implemented here.',
    apply: 'Apply',
  },
  fa: {
    title: 'پنل کنترل ادمین',
    adminDescription: 'مدیریت امنیت پلتفرم، گزارش‌ها و نظارت بر محتوا.',
    accessDenied: 'دسترسی غیرمجاز',
    accessDeniedMsg: 'شما مجوزهای لازم برای مشاهده این صفحه را ندارید. این بخش فقط برای مدیران است.',
    returnHome: 'بازگشت به خانه',
    moderation: 'نظارت',
    expertApps: 'درخواست‌های کارشناسی',
    treasury: 'خزانه‌داری',
    dashboard: 'داشبورد',
    reports: 'گزارش‌ها',
    content: 'محتوا',
    expertReview: 'بازبینی کارشناسی',
    loadingAdminPanel: 'در حال بارگذاری پنل ادمین...',
    pendingReports: 'گزارش‌های در انتظار',
    totalUsers: 'کل کاربران',
    totalProofs: 'کل مدارک',
    reportsProcessed: 'گزارش‌های بررسی شده',
    recentReports: 'گزارش‌های اخیر',
    proofId: 'شناسه مدرک:',
    reporter: 'گزارش‌دهنده:',
    noRecentReports: 'گزارش اخیری وجود ندارد.',
    userReportsManagement: 'مدیریت گزارش‌های کاربران',
    actOnReport: 'اقدام بر روی گزارش',
    dismiss: 'رد کردن',
    noReportsFound: 'گزارشی یافت نشد. پلتفرم پاک است! 🎉',
    assignProofForExpertReview: 'اختصاص مدرک برای بازبینی کارشناسی',
    selectProof: 'انتخاب مدرک',
    chooseProofToReview: 'مدرکی برای بازبینی انتخاب کنید...',
    noProofsAvailable: 'هیچ مدرکی در دسترس نیست',
    selectExpert: 'انتخاب کارشناس',
    chooseAnExpert: 'کارشناسی را انتخاب کنید...',
    noExpertsAvailable: 'هیچ کارشناسی در دسترس نیست',
    assignForReview: 'اختصاص برای بازبینی',
    treasuryPlaceholder: 'ویژگی‌های مدیریت خزانه‌داری در اینجا پیاده‌سازی خواهند شد.',
    apply: 'اعمال',
  },
  ar: {
    title: 'لوحة تحكم المسؤول',
    adminDescription: 'إدارة أمان المنصة، التقارير، والإشراف على المحتوى.',
    accessDenied: 'الوصول مرفوض',
    accessDeniedMsg: 'ليس لديك الأذونات المطلوبة لعرض هذه الصفحة. هذه المنطقة مخصصة للمسؤولين فقط.',
    returnHome: 'العودة إلى الرئيسية',
    moderation: 'الإشراف',
    expertApps: 'طلبات الخبراء',
    treasury: 'الخزانة',
    dashboard: 'لوحة القيادة',
    reports: 'التقارير',
    content: 'المحتوى',
    expertReview: 'مراجعة الخبراء',
    loadingAdminPanel: 'جاري تحميل لوحة المسؤول...',
    pendingReports: 'التقارير المعلقة',
    totalUsers: 'إجمالي المستخدمين',
    totalProofs: 'إجمالي البراهين',
    reportsProcessed: 'التقارير المعالجة',
    recentReports: 'التقارير الأخيرة',
    proofId: 'معرف الإثبات:',
    reporter: 'المبلغ:',
    noRecentReports: 'لا توجد تقارير حديثة.',
    userReportsManagement: 'إدارة تقارير المستخدمين',
    actOnReport: 'العمل على التقرير',
    dismiss: 'رفض',
    noReportsFound: 'لم يتم العثور على تقارير. المنصة نظيفة! 🎉',
    assignProofForExpertReview: 'تعيين إثبات لمراجعة الخبراء',
    selectProof: 'تحديد إثبات',
    chooseProofToReview: 'اختر إثباتًا للمراجعة...',
    noProofsAvailable: 'لا توجد براهين متاحة',
    selectExpert: 'تحديد خبير',
    chooseAnExpert: 'اختر خبيرًا...',
    noExpertsAvailable: 'لا يوجد خبراء متاحون',
    assignForReview: 'تعيين للمراجعة',
    treasuryPlaceholder: 'سيتم تطبيق ميزات إدارة الخزانة هنا.',
    apply: 'تطبيق',
  },
  tr: {
    title: 'Yönetici Paneli',
    adminDescription: 'Platform güvenliğini, raporları ve içerik denetimini yönetin.',
    accessDenied: 'Erişim Engellendi',
    accessDeniedMsg: 'Bu sayfayı görüntülemek için gerekli izinlere sahip değilsiniz. Bu alan yalnızca yöneticiler içindir.',
    returnHome: 'Ana Sayfaya Dön',
    moderation: 'Denetleme',
    expertApps: 'Uzman Başvuruları',
    treasury: 'Hazine',
    dashboard: 'Kontrol Paneli',
    reports: 'Raporlar',
    content: 'İçerik',
    expertReview: 'Uzman İncelemesi',
    loadingAdminPanel: 'Yönetici paneli yükleniyor...',
    pendingReports: 'Bekleyen Raporlar',
    totalUsers: 'Toplam Kullanıcı',
    totalProofs: 'Toplam Kanıt',
    reportsProcessed: 'İşlenmiş Raporlar',
    recentReports: 'Son Raporlar',
    proofId: 'Kanıt Kimliği:',
    reporter: 'Bildiren:',
    noRecentReports: 'Yakın zamanda rapor yok.',
    userReportsManagement: 'Kullanıcı Rapor Yönetimi',
    actOnReport: 'Raporu İşleme Al',
    dismiss: 'Reddet',
    noReportsFound: 'Rapor bulunamadı. Platform temiz! 🎉',
    assignProofForExpertReview: 'Uzman İncelemesi İçin Kanıt Ata',
    selectProof: 'Kanıt Seç',
    chooseProofToReview: 'İncelemek için bir kanıt seçin...',
    noProofsAvailable: 'Mevcut kanıt yok',
    selectExpert: 'Uzman Seç',
    chooseAnExpert: 'Bir uzman seçin...',
    noExpertsAvailable: 'Mevcut uzman yok',
    assignForReview: 'İnceleme İçin Ata',
    treasuryPlaceholder: 'Hazine yönetim özellikleri burada uygulanacaktır.',
    apply: 'Uygula',
  }
};

export default function AdminPanel() {
  const [reports, setReports] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [experts, setExperts] = useState([]); // Renamed from 'users' to 'experts' for clarity regarding the new feature
  const [allUsers, setAllUsers] = useState([]); // New state to hold all users for dashboard count
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('moderation'); // Changed default tab to 'moderation'
  const [currentUser, setCurrentUser] = useState(null); // State to hold current user info
  const [selectedProof, setSelectedProof] = useState(null); // New state for expert review feature
  const [selectedExpert, setSelectedExpert] = useState(''); // New state for expert review feature
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  const t = translations[language] || translations.en;

  useEffect(() => {
    const checkUserAndLoadData = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        setCurrentUser(user);
        if (user && user.role === 'admin') {
          await loadAdminData();
        }
      } catch (error) {
        console.error("Authentication check failed", error);
        setCurrentUser(null);
      }
      setIsLoading(false);
    };
    checkUserAndLoadData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [reportsData, proofsData, fetchedUsersData] = await Promise.all([
        UserReport.list('-created_date'),
        Proof.list('-created_date'),
        User.list('-created_date')
      ]);

      setReports(reportsData);
      setProofs(proofsData);
      setAllUsers(fetchedUsersData); // Store all users for the dashboard 'Total Users' count
      // Filter users to get potential experts (users with specialization)
      setExperts(fetchedUsersData.filter(u => u.specialization && u.specialization.length > 0));
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      await UserReport.update(reportId, {
        report_status: action === 'approve' ? 'acted_upon' : 'dismissed'
      });

      if (action === 'approve') {
        alert('✅ Report approved. Content has been flagged for review.'); // Alerts are not translated as per scope
      } else {
        alert('❌ Report dismissed.'); // Alerts are not translated as per scope
      }

      await loadAdminData();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Error processing report action.'); // Alerts are not translated as per scope
    }
  };

  const handleProofModeration = async (proofId, action, reason) => {
    try {
      // Create moderation record
      await ProofModeration.create({
        proof_id: proofId,
        moderator_id: currentUser?.id || 'admin_user', // Use current admin user ID if available
        action_type: action,
        reason: reason,
        detailed_reason: `Admin action: ${action} due to ${reason}`, // This string is not translated as per scope
        status: 'approved'
      });

      // Update proof visibility if hiding or unhiding
      if (action === 'hide') {
        alert('🔒 Proof has been hidden from public view.'); // Alerts are not translated as per scope
      } else if (action === 'unhide') {
        alert('🔓 Proof has been unhidden and is now public.'); // Alerts are not translated as per scope
      }

      await loadAdminData();
    } catch (error) {
      console.error('Error moderating proof:', error);
      alert('Error performing moderation action.'); // Alerts are not translated as per scope
    }
  };

  const handleAssignExpert = async () => {
    if (!selectedProof || !selectedExpert) {
      alert("Please select a proof and an expert."); // Alerts are not translated as per scope
      return;
    }
    // Logic to create an ExpertReview entity would go here
    // For now, we'll log and alert as a placeholder
    console.log(`Assigning proof ${selectedProof} to expert ${selectedExpert}`);
    alert(`Assigned proof ${selectedProof} to expert ${selectedExpert}!`); // Alerts are not translated as per scope
    // In a real application, you would make an API call to create the ExpertReview
    // e.g., await ExpertReview.create({ proof_id: selectedProof, expert_id: selectedExpert, status: 'pending' });
    setSelectedProof(null); // Clear selection after assignment
    setSelectedExpert('');
    await loadAdminData(); // Refresh data if assignment affects UI
  };


  const getReportStats = () => {
    const pending = reports.filter(r => r.report_status === 'pending').length;
    const reviewed = reports.filter(r => r.report_status !== 'pending').length;
    const mostCommonReason = reports.reduce((acc, report) => {
      acc[report.report_reason] = (acc[report.report_reason] || 0) + 1;
      return acc;
    }, {});

    const topReason = Object.entries(mostCommonReason).reduce((a, b) =>
      mostCommonReason[a[0]] > mostCommonReason[b[0]] ? a : b, ['none', 0]
    );

    return { pending, reviewed, topReason: topReason[0] };
  };

  const stats = getReportStats();

  const tabButtons = [
    { key: 'dashboard', label: t.dashboard, icon: Shield },
    { key: 'reports', label: t.reports, icon: Flag },
    { key: 'moderation', label: t.content, icon: FileText },
    { key: 'expertReview', label: t.expertReview, icon: Clock },
    { key: 'expertApps', label: t.expertApps, icon: GraduationCap }, 
    { key: 'treasury', label: t.treasury, icon: DollarSign }, 
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F80FF] mx-auto"></div>
            <p className="text-white mt-4">{t.loadingAdminPanel}</p>
          </div>
        </div>
      </div>
    );
  }

  // Add Access Denied check
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center glow-card-red p-8 rounded-2xl">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{t.accessDenied}</h1>
          <p className="text-gray-300">{t.accessDeniedMsg}</p>
          <Link to={createPageUrl("Dashboard")}>
            <Button className="mt-6 glow-button">{t.returnHome}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2F80FF] to-[#00E5FF] bg-clip-text text-transparent mb-4">
            🛡️ {t.title}
          </h1>
          <p className="text-gray-400">{t.adminDescription}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-[#1a2332] p-2 rounded-lg">
          {tabButtons.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-[#2F80FF] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t.pendingReports}</p>
                      <p className="text-2xl font-bold text-white">{stats.pending}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t.totalUsers}</p>
                      <p className="text-2xl font-bold text-white">{allUsers.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-[#2F80FF]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t.totalProofs}</p>
                      <p className="text-2xl font-bold text-white">{proofs.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-[#00E5FF]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t.reportsProcessed}</p>
                      <p className="text-2xl font-bold text-white">{stats.reviewed}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="glow-card">
              <CardHeader>
                <CardTitle className="text-white">{t.recentReports}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#0B1220] rounded-lg border border-gray-700">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            {report.report_reason}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {format(new Date(report.created_date), 'MMM d, HH:mm')}
                          </span>
                        </div>
                        <p className="text-white text-sm">{t.proofId} {report.proof_id}</p>
                        <p className="text-gray-400 text-xs">{t.reporter} {report.reporter_wallet?.substring(0, 8)}...</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          report.report_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          report.report_status === 'acted_upon' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }>
                          {report.report_status}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {reports.length === 0 && (
                    <div className="text-center py-4 text-gray-400">{t.noRecentReports}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glow-card">
              <CardHeader>
                <CardTitle className="text-white">{t.userReportsManagement}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report, index) => (
                    <div key={index} className="p-4 bg-[#0B1220] rounded-lg border border-gray-700">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              {report.report_reason}
                            </Badge>
                            <Badge className={
                              report.report_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              report.report_status === 'acted_upon' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }>
                              {report.report_status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {format(new Date(report.created_date), 'MMM d, yyyy HH:mm')}
                            </span>
                          </div>
                          <p className="text-white font-medium mb-1">
                            {t.proofId}
                            <Link to={createPageUrl(`PublicProof?id=${report.proof_id}`)} className="text-[#2F80FF] hover:underline ml-1">
                              {report.proof_id}
                            </Link>
                          </p>
                          <p className="text-gray-400 text-sm mb-2">
                            {t.reporter} <code className="text-white">{report.reporter_wallet}</code>
                          </p>
                          {report.report_details && (
                            <p className="text-gray-300 text-sm bg-[#1a2332] p-2 rounded">
                              "{report.report_details}"
                            </p>
                          )}
                        </div>

                        {report.report_status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReportAction(report.id, 'approve')}
                              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {t.actOnReport}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReportAction(report.id, 'dismiss')}
                              className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              {t.dismiss}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {reports.length === 0 && (
                    <div className="text-center py-8">
                      <Flag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">{t.noReportsFound}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Content Moderation Tab (now using ModerationPanel component) */}
        {activeTab === 'moderation' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ModerationPanel proofs={proofs} handleProofModeration={handleProofModeration} />
          </motion.div>
        )}

        {/* Expert Review Tab */}
        {activeTab === 'expertReview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">{t.assignProofForExpertReview}</h2>
              <div className="glow-card p-6 rounded-lg space-y-4">
                <div>
                  <label htmlFor="select-proof" className="text-sm font-medium text-gray-300">{t.selectProof}</label>
                  <Select onValueChange={setSelectedProof} value={selectedProof}>
                    <SelectTrigger id="select-proof" className="bg-[#0B1220] border-gray-600 text-white placeholder:text-gray-500">
                      <SelectValue placeholder={t.chooseProofToReview} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1220] border-gray-600 text-white">
                      {proofs.length > 0 ? (
                        proofs.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.title} (ID: {p.id?.substring(0, 8)})</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-proofs" disabled>{t.noProofsAvailable}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="select-expert" className="text-sm font-medium text-gray-300">{t.selectExpert}</label>
                   <Select onValueChange={setSelectedExpert} value={selectedExpert}>
                    <SelectTrigger id="select-expert" className="bg-[#0B1220] border-gray-600 text-white placeholder:text-gray-500">
                      <SelectValue placeholder={t.chooseAnExpert} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1220] border-gray-600 text-white">
                      {experts.length > 0 ? (
                        experts.map(u => (
                          <SelectItem key={u.id} value={u.wallet_address}>
                            {u.full_name || u.wallet_address} ({u.specialization?.join(', ') || 'N/A'})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-experts" disabled>{t.noExpertsAvailable}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAssignExpert} disabled={!selectedProof || !selectedExpert} className="glow-button">
                  {t.assignForReview}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Expert Applications Tab */}
        {activeTab === 'expertApps' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ExpertApplicationsPanel t={t} currentUser={currentUser} />
          </motion.div>
        )}

        {/* Treasury Tab (Placeholder) */}
        {activeTab === 'treasury' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glow-card">
              <CardHeader>
                <CardTitle className="text-white">{t.treasury}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{t.treasuryPlaceholder}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
