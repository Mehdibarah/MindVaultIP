import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png', 
  'image/jpeg',
  'video/mp4'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUploadZone({ onFileSelect, selectedFile, fileHash, dragActive, setDragActive }) {
  const fileInputRef = React.useRef();

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('❌ Invalid file type. Only PDF, PNG, JPG, and MP4 files are allowed.');
      return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      alert('❌ File too large. Maximum size is 10MB per proof.');
      return false;
    }
    
    return true;
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, [setDragActive]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      alert('❌ Please upload only ONE file per proof. Each idea/invention needs its own separate proof.');
      return;
    }
    
    if (files.length === 1 && validateFile(files[0])) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect, setDragActive]);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 1) {
      alert('❌ Please upload only ONE file per proof. Each idea/invention needs its own separate proof.');
      return;
    }
    
    if (files.length === 1 && validateFile(files[0])) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Warning Alert */}
      <Alert className="border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-400" />
        <AlertDescription className="text-yellow-300">
          <strong>⚠️ Important:</strong> Registering multiple ideas or inventions in a single file may invalidate your Proof in legal disputes. Please upload one idea per Proof.
        </AlertDescription>
      </Alert>

      <motion.div
        className={`border-2 border-dashed rounded-xl md:rounded-2xl p-4 md:p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-[#2F80FF] bg-[#2F80FF]/5' 
            : selectedFile
            ? 'border-[#22C55E] bg-[#22C55E]/5'
            : 'border-gray-600 hover:border-[#2F80FF]/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.mp4"
        />
        
        <div className="space-y-3 md:space-y-4">
          {selectedFile ? (
            <>
              <div className="w-12 md:w-16 h-12 md:h-16 mx-auto bg-[#22C55E]/20 rounded-full flex items-center justify-center">
                <Check className="w-6 md:w-8 h-6 md:h-8 text-[#22C55E]" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-2">File Selected</h3>
                <p className="text-[#22C55E] font-medium text-sm md:text-base truncate px-2">
                  {selectedFile.name}
                </p>
                <p className="text-gray-400 text-xs md:text-sm mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                </p>
                {fileHash && (
                  <div className="mt-2 bg-[#0B1220] p-2 md:p-3 rounded-lg border border-gray-700">
                    <p className="text-[#00E5FF] text-xs font-mono break-all">
                      SHA-256: {fileHash}
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-[#2F80FF] text-[#2F80FF] hover:bg-[#2F80FF]/10 text-sm md:text-base h-8 md:h-10"
              >
                Choose Different File
              </Button>
            </>
          ) : (
            <>
              <div className="w-12 md:w-16 h-12 md:h-16 mx-auto bg-[#2F80FF]/20 rounded-full flex items-center justify-center">
                <Upload className="w-6 md:w-8 h-6 md:h-8 text-[#2F80FF]" />
              </div>
              <div className="px-2">
                <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                  {dragActive ? 'Drop your file here' : 'Upload Your Single Proof File'}
                </h3>
                <p className="text-gray-400 mb-4 text-sm md:text-base">
                  Drag & drop your file here, or click to browse
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="glow-button text-white font-medium text-sm md:text-base h-9 md:h-11 px-4 md:px-6"
                >
                  <File className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-4 space-y-1">
                <p>📄 Allowed: PDF, PNG, JPG, MP4</p>
                <p>📏 Maximum: 10MB per proof</p>
                <p>🔒 One file = One idea/invention</p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}