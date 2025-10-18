
import React, { useState, useEffect } from 'react';
import { ExpertApplication } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, Brain, ExternalLink } from 'lucide-react';

export default function ExpertApplicationsPanel() {
  const [applications, setApplications] = useState([]);
  const [expandedApp, setExpandedApp] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const apps = await ExpertApplication.list('-created_date');
      setApplications(apps || []);
    } catch (error) {
      console.error('Error loading expert applications:', error);
    }
  };

  const handleApproveApplication = async (applicationId, applicantWallet) => {
    setIsProcessing(true);
    try {
      // Update application status
      await ExpertApplication.update(applicationId, {
        application_status: 'approved',
        review_notes: reviewNote,
        approved_date: new Date().toISOString()
      });

      // Update user to be expert
      const users = await User.list();
      const user = users.find(u => u.wallet_address?.toLowerCase() === applicantWallet.toLowerCase());
      
      if (user) {
        const app = applications.find(a => a.id === applicationId);
        await User.update(user.id, {
          is_expert: true,
          expert_field: app.field_of_expertise,
          expert_approval_date: new Date().toISOString()
        });
      }

      setExpandedApp(null);
      setReviewNote('');
      loadApplications();
      alert('Application approved successfully!');
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Error approving application.');
    }
    setIsProcessing(false);
  };

  const handleRejectApplication = async (applicationId) => {
    setIsProcessing(true);
    try {
      await ExpertApplication.update(applicationId, {
        application_status: 'rejected',
        review_notes: reviewNote
      });

      setExpandedApp(null);
      setReviewNote('');
      loadApplications();
      alert('Application rejected.');
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Error rejecting application.');
    }
    setIsProcessing(false);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'under_review': return <Brain className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'under_review': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No expert applications found.</p>
      ) : (
        applications.map((app) => (
          <Card key={app.id} className="bg-[#1a2332] border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{app.full_name}</CardTitle>
                  <p className="text-gray-400">{app.field_of_expertise} • {app.experience_years} years</p>
                  <code className="text-xs text-gray-500">{app.applicant_wallet}</code>
                </div>
                <Badge className={getStatusColor(app.application_status)}>
                  {getStatusIcon(app.application_status)}
                  {app.application_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">{app.motivation_statement}</p>
                
                <Button
                  variant="outline"
                  onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                  className="border-gray-600"
                >
                  {expandedApp === app.id ? 'Hide Details' : 'View Details'}
                </Button>

                {expandedApp === app.id && (
                  <div className="bg-[#0B1220] p-4 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Education:</h4>
                      <p className="text-gray-300 text-sm">{app.education_background}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Professional Credentials:</h4>
                      <p className="text-gray-300 text-sm">{app.professional_credentials}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Work Experience:</h4>
                      <p className="text-gray-300 text-sm">{app.work_experience}</p>
                    </div>
                    {app.portfolio_links && app.portfolio_links.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Portfolio Links:</h4>
                        <div className="space-y-1">
                          {app.portfolio_links.map((link, index) => (
                            <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                              <ExternalLink className="w-3 h-3" />
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {app.application_status === 'pending' && (
                      <div className="space-y-3 pt-4 border-t border-gray-700">
                        <h4 className="font-semibold text-white">Admin Review:</h4>
                        <Textarea
                          value={reviewNote}
                          onChange={(e) => setReviewNote(e.target.value)}
                          placeholder="Add review notes..."
                          className="bg-[#1a2332] border-gray-600"
                          rows={3}
                        />
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApproveApplication(app.id, app.applicant_wallet)}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectApplication(app.id)}
                            disabled={isProcessing}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
