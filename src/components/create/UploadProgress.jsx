import React from 'react';
import { motion } from 'framer-motion';

function UploadProgress({ step, totalSteps, ipfsHash, txHash }) {
    const steps = [
        { id: 1, label: 'Preparing File', icon: '📄' },
        { id: 2, label: 'Uploading to Secure Storage', icon: '☁️' },
        { id: 3, label: 'Creating Proof Record', icon: '🔐' },
        { id: 4, label: 'Confirming...', icon: '✅' }
    ];

    const progressPercent = Math.max(0, ((step -1) / (steps.length - 1)) * 100);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center py-10 px-4 text-white">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-[#1a2332] rounded-2xl p-8 shadow-2xl border border-gray-700"
            >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Registering Your Innovation</h2>
                <p className="text-gray-400 mb-8">Please don't close this window. Your proof is being secured on the platform.</p>

                <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-8">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2F80FF] to-[#00E5FF]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                    {steps.map((s) => (
                        <div
                            key={s.id}
                            className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                                s.id < step ? 'bg-green-500/20' :
                                s.id === step ? 'bg-blue-500/20' :
                                'bg-gray-700/50'
                            }`}
                        >
                            <div className={`mr-3 text-2xl ${s.id < step ? '' : s.id === step ? 'animate-pulse' : 'opacity-50'}`}>{s.icon}</div>
                            <div>
                                <h3 className={`font-semibold ${s.id < step ? 'text-green-400' : s.id === step ? 'text-blue-300' : 'text-gray-400'}`}>
                                    Step {s.id}
                                </h3>
                                <p className="text-sm text-gray-300">{s.label}</p>
                            </div>
                            {s.id < step && <span className="ml-auto text-green-400">✓</span>}
                        </div>
                    ))}
                </div>

                {ipfsHash && (
                    <div className="mt-8 p-4 bg-gray-900/50 rounded-lg text-left">
                        <p className="font-semibold text-gray-300">Secure Storage ID:</p>
                        <code className="text-sm text-cyan-400 break-all">{ipfsHash}</code>
                    </div>
                )}
                 {txHash && (
                    <div className="mt-4 p-4 bg-gray-900/50 rounded-lg text-left">
                        <p className="font-semibold text-gray-300">Transaction:</p>
                        <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 break-all hover:underline">
                            {txHash}
                        </a>
                    </div>
                )}

            </motion.div>
        </div>
    );
}

export default UploadProgress;