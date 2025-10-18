import React, { useState } from 'react';
import { Proof } from '@/api/entities';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

export default function VisibilityToggle({ proof, onVisibilityChange }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (isPublic) => {
    setIsLoading(true);
    try {
      const updatedProofData = await Proof.update(proof.id, { is_public: isPublic });
      onVisibilityChange(updatedProofData);
    } catch (error) {
      console.error("Failed to update visibility:", error);
      // Optionally revert UI state on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Switch
                checked={proof.is_public}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-500"
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-800 text-white border-gray-700">
          <p>Toggle Public Visibility</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}