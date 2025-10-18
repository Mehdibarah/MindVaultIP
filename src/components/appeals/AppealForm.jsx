import React, { useState } from 'react';
import { ProofAppeal } from '@/api/entities';
import { useWallet } from '../wallet/WalletContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, FileText, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppealForm({ proofId, onCancel }) {
  const { address } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    appeal_reason: '',
    additional_evidence: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.appeal_reason.trim()) {
      alert('Please provide a reason for your appeal.');
      return;
    }

    setIsSubmitting(true);
    try {
      await ProofAppeal.create({
        proof_id: proofId,
        user_wallet: address,
        appeal_reason: formData.appeal_reason.trim(),
        additional_evidence: formData.additional_evidence.trim(),
        appeal_status: 'pending'
      });

      alert('✅ Your appeal has been submitted successfully. We will review it and get back to you within 24-48 hours.');
      onCancel(); // Close the form
    } catch (error) {
      console.error('Error submitting appeal:', error);
      alert('❌ Failed to submit appeal. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="bg-[#1a2332] border border-yellow-500/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-white">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          Submit Appeal for Review
        </CardTitle>
        <p className="text-sm text-gray-300">
          If you believe your proof was incorrectly rejected, please provide details below. Our team will conduct a manual review.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="appeal_reason" className="text-white font-medium">
              Why do you think the AI decision was incorrect? *
            </Label>
            <Textarea
              id="appeal_reason"
              value={formData.appeal_reason}
              onChange={(e) => setFormData({ ...formData, appeal_reason: e.target.value })}
              placeholder="Please explain why you believe your proof meets the criteria for approval. Be specific about novelty, utility, or other factors the AI might have missed."
              className="mt-2 bg-[#0B1220] border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400 min-h-[120px]"
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="additional_evidence" className="text-white font-medium">
              Additional Evidence or References (Optional)
            </Label>
            <Textarea
              id="additional_evidence"
              value={formData.additional_evidence}
              onChange={(e) => setFormData({ ...formData, additional_evidence: e.target.value })}
              placeholder="Provide any additional context, references, or evidence that supports your claim. Include URLs, prior art references, or technical explanations."
              className="mt-2 bg-[#0B1220] border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400 min-h-[100px]"
              rows={4}
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-200 mb-2">Review Process</h4>
                <ul className="text-sm text-yellow-100/80 space-y-1">
                  <li>• Your appeal will be reviewed by our expert team within 24-48 hours</li>
                  <li>• We may run a secondary AI analysis with adjusted parameters</li>
                  <li>• You will receive a notification with the final decision</li>
                  <li>• If approved, you will receive any applicable IDN token rewards</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.appeal_reason.trim() || isSubmitting}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Appeal'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}