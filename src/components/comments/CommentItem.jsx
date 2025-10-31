import React, { useState } from 'react';
// Comments disabled - Base44 removed
// import { useAppWallet } from '../hooks/useAppWallet'; // Removed
// import CommentForm from './CommentForm'; // Removed - comment functionality disabled
import { User, CornerDownRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CommentItem = ({ comment, allComments, onReplySuccess, proofId }) => {
  // const { isConnected } = useAppWallet(); // Removed
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  const replies = allComments.filter(c => c.parent_id === comment.id);

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        {comment.user?.profile_image ? (
          <img className="w-8 h-8 rounded-full" src={comment.user.profile_image} alt={comment.user.full_name} />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-white">{comment.user?.full_name || 'Anonymous'}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_date), { addSuffix: true })}
            </p>
          </div>
          <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
        </div>
        
        <div className="mt-2 flex items-center space-x-4">
           {/* Reply functionality is disabled */}
        </div>

        {/* Reply form is disabled */}

        {replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-6 border-l border-gray-700">
            {replies.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                allComments={allComments}
                onReplySuccess={onReplySuccess}
                proofId={proofId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;