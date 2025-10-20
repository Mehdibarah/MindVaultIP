import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, CheckCircle, Info, Upload, File as FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import UploadProgress from '../components/create/UploadProgress';
import { useWallet } from '@/components/wallet/WalletContext';
// import RegistrationFeePayment from '@/components/contract/RegistrationFeePayment'; // Temporarily disabled due to old contract system
import { safeApiCall } from '@/utils/apiErrorHandler';
import { safeBase44Call } from '@/utils/base44ErrorHandler';

// Helper for SHA-256 Hashing
async function getFileHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function CreateProof() {
    const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
    
    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('invention');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [isPublic, setIsPublic] = useState(true);

    // Process State
    const [status, setStatus] = useState('idle'); // idle, payment, uploading, success, error
    const [step, setStep] = useState(0);
    const [error, setError] = useState('');
    const [createdProof, setCreatedProof] = useState(null);
    const [fileHash, setFileHash] = useState('');
    const [paymentHash, setPaymentHash] = useState('');
    
    // UI State
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    
    // Use global wallet context
    const { address, isConnected, connect, shortAddress } = useWallet();

    // Wallet connection is now handled by the global WalletContext
    // No need for local wallet state management

    const t = {
        pageTitle: 'Register Your Innovation',
        pageSubtitle: 'Secure your intellectual property on the platform for a small fee.',
        formTitle: 'Proof Details',
        titleLabel: 'Title *',
        titlePlaceholder: 'e.g., Solar-Powered Water Purifier',
        titleChars: 'characters',
        categoryLabel: 'Category *',
        selectCategory: 'Select a category...',
        categoryInvention: '💡 Invention',
        categoryDesign: '🎨 Design',
        categoryAlgorithm: '🔢 Algorithm',
        categoryArt: '🖼️ Artistic Work',
        categoryResearch: '🔬 Research/Discovery',
        categorySoftware: '💻 Software',
        categoryBusiness: '📊 Business Method',
        categoryDocument: '📄 Document',
        categoryOther: '📦 Other',
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Describe your innovation, its purpose, and key features...',
        descriptionPlaceholderDocument: 'Describe your document and its purpose for proof of existence...',
        fileLabel: 'Upload File *',
        publicLabel: 'Make publicly visible in marketplace',
        publicHint: 'Private innovations are still registered but not shown in gallery.',
        costLabel: 'Registration Fee',
    costAmount: '0.001 ETH',
        costFiat: '≈ £1.00',
        submitButton: 'Register on Platform',
        submittingButton: 'Registering...',
        infoTitle: 'What happens next?',
        infoStep1: 'Your file is uploaded to secure, decentralized storage.',
        infoStep2: 'A unique cryptographic hash is created from your file.',
        infoStep3: 'Your ownership is permanently recorded.',
        infoStep4: 'You receive an immutable proof of creation.',
        successTitle: 'Successfully Registered!',
        successSubtitle: 'Your innovation is now protected on the platform.',
        goToDashboard: 'Go to Dashboard',
        listForSale: 'List for Sale',
        errorTitle: 'Registration Failed',
        tryAgain: 'Try Again',
        connectPromptTitle: 'Connect Your Wallet',
        connectPromptSubtitle: 'Please connect your wallet using the button in the header above to register your innovation.',
        fileUploadHint: 'Click to upload or drag and drop',
        fileUploadMeta: 'PDF, PNG, JPG, ZIP (Max 10MB)',
        removeFile: '❌'
    };

    const handleFileSelect = async (selectedFile) => {
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert("File is too large. Maximum size is 10MB.");
                return;
            }
            setFile(selectedFile);
            setFileHash('Calculating hash...');
            const hash = await getFileHash(selectedFile);
            setFileHash(hash);
        }
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };
    
    const resetForm = () => {
        setTitle('');
        setCategory('invention');
        setDescription('');
        setFile(null);
        setIsPublic(true);
        setStatus('idle');
        setStep(0);
        setError('');
        setCreatedProof(null);
        setFileHash('');
        setPaymentHash('');
    };

    // Payment handlers
    const handlePaymentSuccess = (hash) => {
        setPaymentHash(hash);
        setStatus('uploading');
        setStep(1);
        // Proceed with registration after payment
        proceedWithRegistration();
    };

    const handlePaymentError = (errorMessage) => {
        setError(errorMessage);
        setStatus('error');
    };

    const proceedWithRegistration = async () => {
        try {
            // Step 2: Upload to IPFS
            setStep(2);
            const ipfsResult = await safeBase44Call(async () => {
                const fileContent = await file.arrayBuffer();
                return base44.proofs.uploadToIpfs({
                    file_hash: fileHash,
                    file_name: file.name,
                    file_size: file.size,
                    file_type: file.type,
                    file_content: Array.from(new Uint8Array(fileContent)),
                });
            }, null);

            if (!ipfsResult || !ipfsResult.ipfs_hash) {
                throw new Error(t.ipfsUploadError || 'Failed to upload to IPFS.');
            }

            // Step 3: Register Proof
            setStep(3);
            const proofData = {
                title,
                category,
                description,
                file_hash: fileHash,
                ipfs_hash: ipfsResult.ipfs_hash,
                is_public: isPublic,
                payment_hash: paymentHash, // Include payment hash
            };
            const registrationResult = await safeBase44Call(() => base44.proofs.registerProof(proofData), null);

            if (!registrationResult || !registrationResult.id) {
                throw new Error(t.proofRegistrationError || 'Failed to register proof.');
            }

            // Step 4: AI Review (initial stage)
            setStep(4);
            setCreatedProof(registrationResult);
            setStatus('success');
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || t.registrationGenericError || 'An unexpected error occurred during registration.');
            setStatus('error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!isConnected) {
            setError(t.connectPromptTitle);
            return;
        }

        if (!title || !category || !description || !file || !fileHash) {
            setError(t.fillAllFieldsError || 'Please fill in all required fields and upload a file.');
            return;
        }

        // Move to payment step instead of direct registration
        setStatus('payment');
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="w-full max-w-md bg-[#1a2332] rounded-2xl p-8 shadow-2xl border border-blue-500/30"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{t.connectPromptTitle}</h2>
                    <p className="text-gray-400 mb-6">{t.connectPromptSubtitle}</p>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-300">
                            👆 Look for the "Connect Wallet" button in the header above
                        </p>
                    </div>
                    <Button 
                        onClick={connect}
                        className="w-full glow-button"
                    >
                        Connect Wallet
                    </Button>
                </motion.div>
            </div>
        );
    }
    
    if (status === 'payment') {
        return (
            <div className="min-h-screen bg-[#0B1220] text-white p-4 sm:p-6 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {t.pageTitle}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Complete your registration by paying the fee
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Registration Summary */}
                        <div className="bg-[#1a2332] rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Registration Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Title:</span>
                                    <span className="text-white">{title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Category:</span>
                                    <span className="text-white">{category === 'invention' ? '💡 Invention' : '📄 Document'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">File:</span>
                                    <span className="text-white">{file?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Visibility:</span>
                                    <span className="text-white">{isPublic ? 'Public' : 'Private'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Component - Temporarily Disabled */}
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                    <Info className="w-6 h-6 text-yellow-500" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Payment System Temporarily Disabled</h3>
                            <p className="text-gray-300 mb-4">
                                The registration fee payment system is currently being updated to work with the new contract system. 
                                You can still create proofs, but payment functionality will be restored soon.
                            </p>
                            <Button
                                onClick={handlePaymentSuccess}
                                className="bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-black font-semibold"
                            >
                                Continue Without Payment
                            </Button>
                        </div>

                        {/* Back Button */}
                        <div className="text-center">
                            <Button
                                onClick={() => setStatus('idle')}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                ← Back to Form
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (status === 'success' && createdProof) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg bg-[#1a2332] rounded-2xl p-8 shadow-2xl border border-green-500/30">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">{t.successTitle}</h2>
                    <p className="text-gray-400 mb-6">{t.successSubtitle}</p>
                        <div className="text-left bg-gray-900/50 rounded-lg p-4 space-y-2 mb-8">
                            <p className="text-white"><strong>Title:</strong> {createdProof.title}</p>
                            <p className="text-white"><strong>Proof ID:</strong> <code className="text-cyan-400">{createdProof.id}</code></p>
                            <p className="text-white"><strong>File Hash (SHA-256):</strong> <code className="text-cyan-400 text-xs break-all">{createdProof.file_hash}</code></p>
                            {paymentHash && (
                                <p className="text-white"><strong>Payment Hash:</strong> <code className="text-green-400 text-xs break-all">{paymentHash}</code></p>
                            )}
                        </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to={createPageUrl('Dashboard')} className="w-full">
                            <Button variant="outline" className="w-full">{t.goToDashboard}</Button>
                        </Link>
                        <Link to={createPageUrl(`Marketplace`)} className="w-full">
                           <Button className="w-full glow-button">{t.listForSale}</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }
    
    if (status === 'uploading') {
        return <UploadProgress step={step} totalSteps={4} ipfsHash={fileHash} />;
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                 <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg bg-[#1a2332] rounded-2xl p-8 shadow-2xl border border-red-500/30">
                    <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">{t.errorTitle}</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Button onClick={resetForm} variant="destructive">{t.tryAgain}</Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{t.pageTitle}</h1>
                <p className="text-gray-400 mt-2">{t.pageSubtitle}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6 bg-[#1a2332] p-8 rounded-2xl border border-gray-700">
                    <h2 className="text-xl font-bold text-white border-l-4 border-blue-400 pl-4">{t.formTitle}</h2>
                    
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">{t.titleLabel}</label>
                        <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.titlePlaceholder} required maxLength={100} className="bg-[#0B1220] border-gray-600" />
                        <small className="text-gray-500 text-xs mt-1 block text-right">{title.length}/100 {t.titleChars}</small>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">{t.categoryLabel}</label>
                        <Select onValueChange={setCategory} value={category} required>
                            <SelectTrigger className="bg-[#0B1220] border-gray-600"><SelectValue placeholder={t.selectCategory} /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="invention">{t.categoryInvention}</SelectItem>
                                <SelectItem value="design">{t.categoryDesign}</SelectItem>
                                <SelectItem value="algorithm">{t.categoryAlgorithm}</SelectItem>
                                <SelectItem value="art">{t.categoryArt}</SelectItem>
                                <SelectItem value="research">{t.categoryResearch}</SelectItem>
                                <SelectItem value="software">{t.categorySoftware}</SelectItem>
                                <SelectItem value="business">{t.categoryBusiness}</SelectItem>
                                <SelectItem value="document">{t.categoryDocument}</SelectItem>
                                <SelectItem value="other">{t.categoryOther}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Document category description */}
                    {category === 'document' && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="text-blue-400 text-lg">📄</div>
                                <div>
                                    <h4 className="text-blue-400 font-medium mb-1">Document Registration</h4>
                                    <p className="text-gray-300 text-sm">
                                        Store and timestamp your document permanently on the blockchain to preserve authorship or proof of existence. 
                                        Only the file hash is stored on-chain, not the document content, ensuring privacy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">{t.descriptionLabel}</label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={category === 'document' ? t.descriptionPlaceholderDocument : t.descriptionPlaceholder} rows={5} maxLength={1000} className="bg-[#0B1220] border-gray-600" />
                        <small className="text-gray-500 text-xs mt-1 block text-right">{description.length}/1000 {t.titleChars}</small>
                    </div>
                    
                    <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">{t.fileLabel}</label>
                         <div 
                            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                         >
                            <input ref={fileInputRef} id="file-upload" type="file" onChange={handleFileInputChange} accept=".pdf,.png,.jpg,.jpeg,.zip" className="hidden" />
                            {!file ? (
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2"/>
                                    <p className="font-semibold text-white">{t.fileUploadHint}</p>
                                    <p className="text-xs text-gray-500">{t.fileUploadMeta}</p>
                                </label>
                            ) : (
                                <div>
                                    <FileIcon className="w-10 h-10 mx-auto text-green-500 mb-2"/>
                                    <p className="font-semibold text-green-400 break-all">{file.name}</p>
                                    <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <p className="text-xs text-cyan-500 font-mono break-all mt-2">{fileHash}</p>
                                    <Button type="button" variant="link" size="sm" className="text-red-500" onClick={() => {setFile(null); setFileHash(''); if (fileInputRef.current) fileInputRef.current.value = null;}}>{t.removeFile}</Button>
                                </div>
                            )}
                         </div>
                    </div>

                    <div className="flex items-start space-x-3 pt-2 rtl:space-x-reverse">
                        <input id="isPublic" type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="h-4 w-4 mt-1 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"/>
                        <div className="text-sm">
                            <label htmlFor="isPublic" className="font-medium text-white">{t.publicLabel}</label>
                            <p className="text-gray-500">{t.publicHint}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <div className="bg-[#1a2332] p-6 rounded-2xl border border-gray-700 text-center">
                        <div className="mb-4">
                            <p className="text-gray-400">{t.costLabel}</p>
                            <p className="text-2xl font-bold text-white">{t.costAmount} <span className="text-lg font-medium text-gray-500">{t.costFiat}</span></p>
                        </div>
                        <Button type="submit" size="lg" className="w-full glow-button" disabled={!file || !title || status === 'uploading' || fileHash === 'Calculating hash...'}>
                           {status === 'uploading' ? t.submittingButton : t.submitButton}
                        </Button>
                    </div>

                    <div className="bg-[#1a2332] p-6 rounded-2xl border border-gray-700 text-sm">
                        <h4 className="font-bold text-white mb-3 flex items-center"><Info className="w-4 h-4 mr-2 text-blue-400"/>{t.infoTitle}</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-400 pl-2">
                            <li>{t.infoStep1}</li>
                            <li>{t.infoStep2}</li>
                            <li>{t.infoStep3}</li>
                            <li>{t.infoStep4}</li>
                        </ol>
                    </div>
                </div>
            </form>
        </div>
    );
}