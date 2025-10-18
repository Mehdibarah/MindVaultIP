import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, Wrench, FileText, Shield, TrendingUp } from 'lucide-react';

const scoreCategories = [
  { key: 'ai_novelty_score', label: 'Novelty & Uniqueness', icon: Lightbulb, color: 'text-yellow-400' },
  { key: 'ai_inventive_score', label: 'Inventive Step', icon: Brain, color: 'text-purple-400' },
  { key: 'ai_utility_score', label: 'Utility & Application', icon: Wrench, color: 'text-blue-400' },
  { key: 'ai_clarity_score', label: 'Clarity & Documentation', icon: FileText, color: 'text-green-400' },
];

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-400 bg-green-400/20';
  if (score >= 60) return 'text-yellow-400 bg-yellow-400/20';
  return 'text-red-400 bg-red-400/20';
};

const getProgressColor = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function AIScoreBreakdown({ proof }) {
  if (!proof.ai_final_score) return null;

  const finalScore = proof.ai_final_score || 0;
  const passed = finalScore >= 70;

  return (
    <Card className="glow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Patent Review Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Final Score */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`text-4xl font-bold ${getScoreColor(finalScore).split(' ')[0]}`}>
              {finalScore}/100
            </div>
            <Badge className={`${passed ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} text-sm`}>
              {passed ? 'APPROVED FOR PATENT' : 'NEEDS IMPROVEMENT'}
            </Badge>
          </div>
          <Progress 
            value={finalScore} 
            className="h-3 mb-4"
            style={{
              background: 'rgba(55, 65, 81, 0.5)'
            }}
          />
          {proof.ai_review_summary && (
            <p className="text-gray-300 text-sm italic">
              "{proof.ai_review_summary}"
            </p>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoreCategories.map((category) => {
            const score = proof[category.key] || 0;
            const IconComponent = category.icon;
            
            return (
              <div key={category.key} className="bg-[#0B1220] p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${category.color}`} />
                    <span className="text-sm font-medium text-white">{category.label}</span>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(score).split(' ')[0]}`}>
                    {score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(score)}`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Feedback */}
        {proof.ai_feedback && (
          <div className="bg-[#0B1220] p-4 rounded-lg border border-gray-700">
            <h4 className="flex items-center gap-2 font-medium text-white mb-3">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              AI Feedback & Recommendations
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {proof.ai_feedback}
            </p>
          </div>
        )}

        {/* Patent Potential */}
        {proof.ai_review_result?.patent_potential && (
          <div className="text-center">
            <Badge variant="outline" className="text-sm">
              Patent Potential: {proof.ai_review_result.patent_potential}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}