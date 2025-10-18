
import React, { useState, useEffect } from 'react';
import { FileText, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '@/components/utils/whitePaperTranslations.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Section = ({ title, children, isRTL }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    className={`py-8 md:py-10 border-b border-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}
  >
    <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[#2F80FF] to-[#00E5FF] bg-clip-text text-transparent">
      {title}
    </h2>
    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
      {children}
    </div>
  </motion.section>
);

export default function WhitePaperPage() {
    const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

    useEffect(() => {
        const handleLanguageChange = () => {
            setLanguage(localStorage.getItem('lang') || 'en');
        };
        window.addEventListener('languageChange', handleLanguageChange);
        return () => window.removeEventListener('languageChange', handleLanguageChange);
    }, []);

    const t = translations[language] || translations.en;
    const isRTL = ['fa', 'ar', 'ur', 'bal'].includes(language);

    return (
        <div className="min-h-screen bg-[#0B1220] text-white" dir={isRTL ? 'rtl' : 'ltr'}>
            <header className="py-16 md:py-24 text-center bg-gray-900/50">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
                    <FileText className="w-16 h-16 mx-auto mb-6 text-[#00E5FF]" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.mainTitle}</h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">{t.subtitle}</p>
                </motion.div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* 1. Abstract */}
                <Section title={t.s1Title} isRTL={isRTL}>
                    <p>{t.s1Content}</p>
                </Section>

                {/* 2. The Dual Problem */}
                <Section title={t.s2Title} isRTL={isRTL}>
                    <p>{t.s2Content}</p>
                    <div className="mt-6 space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">{t.s2p1Title}</h3>
                            <p>{t.s2p1Content}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">{t.s2p2Title}</h3>
                            <p style={{ whiteSpace: 'pre-line' }}>{t.s2p2Content}</p>
                        </div>
                    </div>
                </Section>

                {/* 3. The Solution */}
                <Section title={t.s3Title} isRTL={isRTL}>
                    <p>{t.s3Content}</p>
                    <ul className="list-decimal pl-5 mt-4 space-y-2">
                        <li>{t.s3Pillar1}</li>
                        <li>{t.s3Pillar2}</li>
                        <li>{t.s3Pillar3}</li>
                    </ul>
                </Section>

                {/* 4. The Token */}
                <Section title={t.s4Title} isRTL={isRTL}>
                    <p>{t.s4Content}</p>
                    <h3 className="text-xl font-semibold text-white mt-6 mb-2">{t.s4UtilitiesTitle}</h3>
                     <ul className="space-y-3 list-disc list-inside">
                        <li>{t.s4Utility1}</li>
                        <li>{t.s4Utility2}</li>
                        <li>{t.s4Utility3}</li>
                        <li>{t.s4Utility4}</li>
                    </ul>
                </Section>

                {/* 5. Tokenomics */}
                <Section title={t.s5Title} isRTL={isRTL}>
                    <div className="overflow-x-auto glow-card p-1 rounded-lg">
                        <Table>
                            <TableHeader><TableRow className="border-gray-700">
                                <TableHead className="text-white">{t.s5TableHeaders.category}</TableHead>
                                <TableHead className="text-white">{t.s5TableHeaders.tokens}</TableHead>
                                <TableHead className="text-white">{t.s5TableHeaders.percent}</TableHead>
                                <TableHead className="text-white">{t.s5TableHeaders.description}</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>
                                {t.s5TableData.map(item => (
                                    <TableRow key={item.category} className="border-gray-800">
                                        <TableCell className="font-medium">{item.category}</TableCell>
                                        <TableCell>{item.tokens}</TableCell>
                                        <TableCell>{item.percent}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Section>

                {/* 6. Future Issuance */}
                <Section title={t.s6Title} isRTL={isRTL}>
                    <p>{t.s6Content}</p>
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                       <li>{t.s6Item1}</li>
                       <li>{t.s6Item2}</li>
                    </ul>
                    <p className="mt-4">{t.s6Outro}</p>
                </Section>

                {/* 7. Vesting */}
                <Section title={t.s7Title} isRTL={isRTL}>
                    <div className="overflow-x-auto glow-card p-1 rounded-lg">
                        <Table>
                            <TableHeader><TableRow className="border-gray-700">
                                <TableHead className="text-white">{t.s7TableHeaders.group}</TableHead>
                                <TableHead className="text-white">{t.s7TableHeaders.startYear}</TableHead>
                                <TableHead className="text-white">{t.s7TableHeaders.releaseRate}</TableHead>
                                <TableHead className="text-white">{t.s7TableHeaders.notes}</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>
                                {t.s7TableData.map(item => (
                                    <TableRow key={item.group} className="border-gray-800">
                                        <TableCell>{item.group}</TableCell>
                                        <TableCell>{item.startYear}</TableCell>
                                        <TableCell>{item.releaseRate}</TableCell>
                                        <TableCell>{item.notes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Section>

                {/* 8. Governance */}
                <Section title={t.s8Title} isRTL={isRTL}>
                    <p>{t.s8Content}</p>
                     <ul className="list-disc pl-5 mt-4 space-y-2">
                        <li>{t.s8Item1}</li>
                        <li>{t.s8Item2}</li>
                        <li>{t.s8Item3}</li>
                        <li>{t.s8Item4}</li>
                    </ul>
                </Section>

                {/* 9. Security */}
                <Section title={t.s9Title} isRTL={isRTL}>
                     <ul className="list-disc pl-5 mt-4 space-y-2">
                        <li>{t.s9Item1}</li>
                        <li>{t.s9Item2}</li>
                        <li>{t.s9Item3}</li>
                        <li>{t.s9Item4}</li>
                    </ul>
                </Section>

                {/* 10. Roadmap */}
                <Section title={t.s10Title} isRTL={isRTL}>
                    <div className="space-y-4">
                        {t.s10TableData.map(item => (
                            <div key={item.year} className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                                <div className="font-bold text-lg text-blue-400 w-full sm:w-48 shrink-0">{item.year}</div>
                                <div className="border-l-2 border-blue-500/50 pl-4 sm:pl-6">{item.milestone}</div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* New Section for Utility Table */}
                <Section title={t.utilityTableTitle} isRTL={isRTL}>
                     <div className="overflow-x-auto glow-card p-1 rounded-lg">
                        <Table>
                            <TableHeader><TableRow className="border-gray-700">
                                <TableHead className="text-white">{t.utilityTableHeaders.utility}</TableHead>
                                <TableHead className="text-white">{t.utilityTableHeaders.purpose}</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>
                                {t.utilityTableData.map(item => (
                                    <TableRow key={item.utility} className="border-gray-800">
                                        <TableCell className="font-medium">{item.utility}</TableCell>
                                        <TableCell>{item.purpose}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Section>

                {/* New Section for Token Specification */}
                <Section title={t.tokenSpecTitle} isRTL={isRTL}>
                     <div className="overflow-x-auto glow-card p-1 rounded-lg">
                        {/* No table content provided in the outline for this section, so it remains empty as per instructions. */}
                    </div>
                </Section>

                {/* 11. Conclusion */}
                <Section title={t.s11Title} isRTL={isRTL}>
                    <p>{t.s11Content}</p>
                    <div className="mt-8 text-center text-xl italic text-blue-300 font-semibold">
                        <p>{t.s11Tagline}</p>
                    </div>
                </Section>
            </main>
        </div>
    );
}
