
import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import CommentItem from './CommentItem';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const translations = {
  en: {
    comments: 'Comments',
    commentingDisabled: 'Commenting is temporarily disabled.',
  },
  fa: {
    comments: 'نظرات',
    commentingDisabled: 'ارسال نظر موقتاً غیرفعال است.',
  },
};

export default function CommentSection({ proofId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    const handleLanguageChange = () => setLanguage(localStorage.getItem('lang') || 'en');
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = translations[language] || translations.en;

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await base44.entities.Comment.filter({ proof_id: proofId }, '-created_date');
      
      // The user lookup might fail if wallet_address is the only key, but we still display comments.
      const userWallets = [...new Set(fetchedComments.map(c => c.user_wallet).filter(Boolean))];
      let userMap = {};
      if (userWallets.length > 0) {
        const users = await base44.entities.User.filter({ wallet_address: { $in: userWallets } });
        userMap = users.reduce((acc, user) => {
          acc[user.wallet_address] = user;
          return acc;
        }, {});
      }
      
      const populatedComments = fetchedComments.map(comment => ({
        ...comment,
        user: userMap[comment.user_wallet] || { full_name: 'Anonymous', profile_image: '' }
      }));

      setComments(populatedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [proofId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentPosted = () => {
    fetchComments();
  };

  const topLevelComments = comments.filter(c => !c.parent_id);

  return (
    <Card className="glow-card">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" /> {t.comments}
        </h3>
        
        {/* Comment form is disabled as wallet functionality is removed */}
        <div className="text-center p-4 border border-dashed border-gray-600 rounded-lg">
          <p className="text-gray-400">{t.commentingDisabled}</p>
        </div>

        <div className="mt-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            topLevelComments.map(comment => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                allComments={comments}
                onReplySuccess={handleCommentPosted}
                proofId={proofId}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
