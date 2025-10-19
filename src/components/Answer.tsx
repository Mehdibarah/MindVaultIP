import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';

interface Source {
  id: number;
  title: string;
  url: string;
}

interface AnswerProps {
  text: string;
  sources: Source[];
  usedWeb: boolean;
  intent: 'GENERAL' | 'IP';
  language: 'fa' | 'en';
}

export function Answer({ text, sources, usedWeb, intent, language }: AnswerProps) {
  const formatText = (text: string) => {
    // Convert line breaks to <br> tags
    return text.replace(/\n/g, '<br/>');
  };

  const getWebIndicator = () => {
    if (!usedWeb) return null;
    
    return (
      <div className="flex items-center gap-1 text-xs text-blue-400 mb-2">
        <Globe className="w-3 h-3" />
        <span>
          {language === 'fa' ? '🔍 از وب استفاده شد' : '🔍 Web research used'}
        </span>
      </div>
    );
  };

  const getIntentBadge = () => {
    if (intent === 'IP') {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-md mb-2">
          <span>🧠</span>
          <span>{language === 'fa' ? 'متخصص مالکیت فکری' : 'IP Expert Mode'}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="prose prose-sm max-w-none">
      {getWebIndicator()}
      {getIntentBadge()}
      
      <div 
        className="text-slate-200 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatText(text) }} 
      />
      
      {usedWeb && sources && sources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700">
          <div className="text-xs text-slate-400 mb-2">
            {language === 'fa' ? 'منابع:' : 'Sources:'}
          </div>
          <div className="space-y-1">
            {sources.map(source => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  [{source.id}] {source.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Answer;
