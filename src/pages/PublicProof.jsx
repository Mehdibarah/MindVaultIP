
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Icons
import { Loader2, AlertTriangle, FileText, Image, Film, Music, Archive, User as UserIcon, Calendar, Hash, ExternalLink, Globe, Lock, Share2, MessageSquare, Download } from 'lucide-react';
import { format } from 'date-fns';

// Feature Components
import ValidationStatusBadge from '../components/proof/ValidationStatusBadge';
import AIScoreBreakdown from '../components/ai-review/AIScoreBreakdown';
import StartChatButton from '../components/chat/StartChatButton';
import DemoVideoManager from '../components/user/DemoVideoManager';
import ReportProofButton from '../components/moderation/ReportProofButton';
const CommentSection = React.lazy(() => import('../components/comments/CommentSection'));
import { proofClient } from '@/services/index';


const translations = {
    en: {
        proofNotFound: 'Proof Not Found',
        accessDenied: 'Access Denied',
        loadingError: 'Error Loading Proof',
        errorTitle: 'An Error Occurred',
        connectToView: 'This proof is private. Viewing is not possible at this time.',
        backToDashboard: 'Back to Dashboard',
        yourProof: 'Your Proof',
        by: 'By',
        unknownUser: 'Unknown User',
        createdOn: 'Created on',
        aiAnalysis: 'AI Analysis',
        description: 'Description',
        proofDetails: 'Proof Details',
        publicAccess: 'Public Access',
        privateAccess: 'Private Access',
        fileName: 'File Name',
        fileSize: 'File Size',
        fileHash: 'File Hash (SHA-256)',
        transactionId: 'Transaction ID',
        share: 'Share',
        download: 'Download',
        noProofId: 'No Proof ID was provided in the URL.'
    },
    fa: {
        proofNotFound: 'گواهی یافت نشد',
        accessDenied: 'دسترسی غیرمجاز',
        loadingError: 'خطا در بارگذاری گواهی',
        errorTitle: 'خطایی روی داد',
        connectToView: 'این گواهی خصوصی است. مشاهده آن در حال حاضر امکان‌پذیر نیست.',
        backToDashboard: 'بازگشت به داشبورد',
        yourProof: 'گواهی شما',
        by: 'توسط',
        unknownUser: 'کاربر ناشناس',
        createdOn: 'ایجاد شده در',
        aiAnalysis: 'تحلیل هوش مصنوعی',
        description: 'توضیحات',
        proofDetails: 'جزئیات گواهی',
        publicAccess: 'دسترسی عمومی',
        privateAccess: 'دسترسی خصوصی',
        fileName: 'نام فایل',
        fileSize: 'اندازه فایل',
        fileHash: 'هش فایل (SHA-256)',
        transactionId: 'شناسه تراکنش',
        share: 'اشتراک‌گذاری',
        download: 'دانلود',
        noProofId: 'شناسه گواهی در آدرس ارائه نشده است.'
    },
};


export default function PublicProof() {
    const [searchParams] = useSearchParams();
    const proofId = searchParams.get('id');

    const [proof, setProof] = useState(null);
    const [owner, setOwner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
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

    const t = translations[language] || translations.en;

    useEffect(() => {
        if (!proofId) {
            setError(t.noProofId);
            setIsLoading(false);
            return;
        }

        const loadData = async () => {
            setIsLoading(true);
            try {
                const client = await proofClient();
                const proofData = await client.get(proofId);
                
                if (!proofData) {
                    setError(t.proofNotFound);
                    setIsLoading(false);
                    return;
                }
                
                // Since wallet is removed, isOwner is always false for public view.
                const isOwner = false;

                if (!proofData.is_public && !isOwner) {
                    setError(t.accessDenied);
                    setProof(proofData); 
                    setIsLoading(false);
                    return;
                }

                setProof(proofData);
                
                // Fetch owner data based on created_by email if wallet address is not available/reliable
                // Note: User filtering is Base44-specific, will need separate client if needed
                if (proofData.created_by) {
                    // For now, use created_by as owner name
                    setOwner({ full_name: proofData.created_by });
                }


            } catch (err) {
                console.error("Error loading proof:", err);
                setError(t.loadingError);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [proofId]); // Dependency on `t` (translation object) is removed to prevent re-fetching on language change

    const truncateText = (text, length = 20) => {
        if (!text) return '';
        if (text.length <= length) return text;
        return `${text.substring(0, length)}...${text.substring(text.length - 4)}`;
    };

    const getFileIcon = (fileType) => {
        if (!fileType) return <FileText className="w-5 h-5" />;
        if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
        if (fileType.startsWith('video/')) return <Film className="w-5 h-5" />;
        if (fileType.startsWith('audio/')) return <Music className="w-5 h-5" />;
        if (fileType.includes('zip') || fileType.includes('archive')) return <Archive className="w-5 h-5" />;
        return <FileText className="w-5 h-5" />;
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">{t.errorTitle}</h2>
                <p className="text-gray-400">{error}</p>
                 {error === t.accessDenied && (
                     <div className="mt-6">
                        <p className="mb-4 text-gray-500">{t.connectToView}</p>
                     </div>
                 )}
                <Link to={createPageUrl('Dashboard')}>
                    <Button variant="outline" className="mt-6">{t.backToDashboard}</Button>
                </Link>
            </div>
        );
    }
    
    if (!proof) {
        return null;
    }

    // Since wallet is removed, isOwner is always false for public view.
    const isOwner = false;

    return (
        <div className="p-4 md:p-8" dir={['fa', 'ar', 'ur', 'bal'].includes(language) ? 'rtl' : 'ltr'}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <Card className="glow-card">
                        <CardContent className="p-6">
                             <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge className="bg-[#2F80FF]/20 text-[#2F80FF] border-[#2F80FF]/30">{proof.category}</Badge>
                                        <ValidationStatusBadge validationStatus={proof.validation_status} />
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white break-words">{proof.title}</h1>
                                </div>
                                <div className="flex-shrink-0">
                                    {isOwner ? (
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{t.yourProof}</Badge>
                                    ) : (
                                       owner && <StartChatButton proofId={proof.id} proofOwnerEmail={proof.created_by} />
                                    )}
                                </div>
                            </div>
                            
                            <Separator className="my-4 bg-gray-700" />
                            
                             <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" />
                                     <span>{t.by} <span className="text-blue-400">{owner?.full_name || t.unknownUser}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{t.createdOn} {format(new Date(proof.created_date), 'PPP')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Review Card */}
                    {proof.validation_status !== 'pending_ai_review' && proof.ai_final_score != null && (
                         <Card className="glow-card">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">{t.aiAnalysis}</h3>
                                <AIScoreBreakdown
                                    novelty={proof.ai_novelty_score}
                                    inventive={proof.ai_inventive_score}
                                    utility={proof.ai_utility_score}
                                    clarity={proof.ai_clarity_score}
                                    finalScore={proof.ai_final_score}
                                    feedback={proof.ai_feedback}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Description Card */}
                    {proof.description && (
                        <Card className="glow-card">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">{t.description}</h3>
                                <p className="text-gray-300 whitespace-pre-wrap">{proof.description}</p>
                            </CardContent>
                        </Card>
                    )}
                    
                    {isOwner && proof.category === 'invention' && proof.validation_status === 'expert_approved' && (
                        <DemoVideoManager proofId={proof.id} initialVideos={proof.demo_videos || []} />
                    )}


                    {/* Comments Section */}
                    <Suspense fallback={<div className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></div>}>
                        <CommentSection proofId={proofId} />
                    </Suspense>

                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="glow-card sticky top-24">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-white">{t.proofDetails}</h3>
                                {proof.is_public ? (
                                    <div className="flex items-center gap-1.5 text-xs text-green-400">
                                        <Globe className="w-4 h-4" /> {t.publicAccess}
                                    </div>
                                ) : (
                                     <div className="flex items-center gap-1.5 text-xs text-yellow-400">
                                        <Lock className="w-4 h-4" /> {t.privateAccess}
                                    </div>
                                )}
                            </div>
                            
                            <Separator className="bg-gray-700" />
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">{t.fileName}</span>
                                    <span className="text-white font-medium flex items-center gap-2">{getFileIcon(proof.file_type)} {truncateText(proof.file_name)}</span>
                                 </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">{t.fileSize}</span>
                                    <span className="text-white font-medium">{(proof.file_size / 1024).toFixed(2)} KB</span>
                                </div>
                                <div className="flex justify-between items-start gap-2">
                                    <span className="text-gray-400 flex-shrink-0">{t.fileHash}</span>
                                    <code className="text-blue-400 break-all text-right">{truncateText(proof.file_hash)}</code>
                                </div>
                                {proof.transaction_id && (
                                     <div className="flex justify-between items-center gap-2">
                                        <span className="text-gray-400">{t.transactionId}</span>
                                        <a href={`https://basescan.org/tx/${proof.transaction_id}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                            {truncateText(proof.transaction_id, 10)}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                )}
                                {proof.ipfs_cid && (
                                     <div className="flex justify-between items-center gap-2">
                                        <span className="text-gray-400">IPFS CID</span>
                                        <a href={`https://ipfs.io/ipfs/${proof.ipfs_cid}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                            {truncateText(proof.ipfs_cid, 10)}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-gray-700" />

                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline"><Share2 className="w-4 h-4 mr-2" />{t.share}</Button>
                                {isOwner && (
                                    <Button variant="outline"><Download className="w-4 h-4 mr-2"/>{t.download}</Button>
                                )}
                            </div>
                             <div className="pt-2">
                                <ReportProofButton proofId={proof.id} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
