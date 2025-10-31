import React, { useState, useEffect } from 'react';
import { UserReport, ProofModeration, Proof } from '@/services/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Flag, Eye, EyeOff, RotateCcw } from 'lucide-react';

export default function ModerationPanel() {
  const [reports, setReports] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const allReports = await UserReport.list('-created_date');
      const allProofs = await Proof.list();
      
      setReports(allReports);
      setProofs(allProofs);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
    setIsLoading(false);
  };

  const handleModerationAction = async (report, action) => {
    try {
      const proof = proofs.find(p => p.id === report.proof_id);
      if (!proof) return;

      // Create moderation record
      await ProofModeration.create({
        proof_id: report.proof_id,
        moderator_id: 'admin', // You should get actual admin ID
        action_type: action,
        reason: report.report_reason,
        detailed_reason: `Community reported: ${report.report_details}`,
        is_community_reported: true,
        reporter_count: 1
      });

      // Update proof visibility if hiding
      if (action === 'hide') {
        await Proof.update(proof.id, { is_public: false });
      } else if (action === 'restore') {
        await Proof.update(proof.id, { is_public: true });
      }

      // Update report status
      await UserReport.update(report.id, { 
        report_status: action === 'hide' ? 'acted_upon' : 'reviewed' 
      });

      loadReports(); // Reload data
      alert(`Action completed: ${action}`);
      
    } catch (error) {
      console.error('Error handling moderation:', error);
      alert('Error processing moderation action');
    }
  };

  const pendingReports = reports.filter(r => r.report_status === 'pending');

  return (
    <div className="p-6 bg-[#0B1220] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-[#2F80FF]" />
          <h1 className="text-3xl font-bold text-white">Content Moderation</h1>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            {pendingReports.length} Pending
          </Badge>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Loading reports...</div>
        ) : pendingReports.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Flag className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No pending reports. Great job maintaining a clean community!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingReports.map(report => {
              const proof = proofs.find(p => p.id === report.proof_id);
              if (!proof) return null;

              return (
                <Card key={report.id} className="bg-[#1a2332] border-gray-600">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Flag className="w-5 h-5 text-red-400" />
                          Report for: {proof.title}
                        </CardTitle>
                        <p className="text-gray-400 mt-1">
                          Reported by: {report.reporter_wallet?.substring(0, 8)}...
                        </p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        {report.report_reason}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Report Details:</h4>
                        <p className="text-gray-300 bg-[#0B1220] p-3 rounded border border-gray-700">
                          {report.report_details}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Proof Information:</h4>
                        <div className="bg-[#0B1220] p-3 rounded border border-gray-700">
                          <p className="text-gray-300">Category: {proof.category}</p>
                          <p className="text-gray-300">Status: {proof.validation_status}</p>
                          <p className="text-gray-300">Owner: {proof.owner_wallet_address}</p>
                          <p className="text-gray-300">Public: {proof.is_public ? 'Yes' : 'No'}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => handleModerationAction(report, 'dismiss')}
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          Dismiss Report
                        </Button>
                        <Button
                          onClick={() => handleModerationAction(report, 'hide')}
                          className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                        >
                          <EyeOff className="w-4 h-4" />
                          Hide Content
                        </Button>
                        {!proof.is_public && (
                          <Button
                            onClick={() => handleModerationAction(report, 'restore')}
                            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}