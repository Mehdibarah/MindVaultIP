import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Lock, ShieldCheck } from 'lucide-react';
import { translations } from '../components/utils/landingPageTranslations';
import { getCurrentLocale, isRTL } from '@/utils/i18nConfig';

const Section = ({ children, className = '' }) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8 }}
    className={`py-16 md:py-24 px-6 md:px-8 ${className}`}
  >
    <div className="max-w-4xl mx-auto">
      {children}
    </div>
  </motion.section>
);

const Quote = ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-6 my-8 text-lg md:text-xl italic text-gray-300">
        {children}
    </blockquote>
);

export default function LandingPage() {
  const [language, setLanguage] = useState(getCurrentLocale());

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(getCurrentLocale());
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);
  
  const t = translations[language] || translations.en;
  const isRTLDirection = isRTL(language);

  return (
    <div className="bg-[#0B1220] text-white font-sans" dir={isRTLDirection ? 'rtl' : 'ltr'}>

      {/* Hero Section */}
      <Section className="text-center pt-24 md:pt-40">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {t.heroTitle}
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {t.heroTagline}
        </p>
        <p className="mt-4 text-gray-400 leading-relaxed max-w-3xl mx-auto">
            {t.heroSubtitle}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={createPageUrl('CreateProof')}>
                <Button size="lg" className="glow-button font-bold px-10 py-7 text-lg w-full sm:w-auto">
                    {t.createProof}
                </Button>
            </Link>
            <Link to={createPageUrl('MindVaultIPWhitePaper')}>
                 <Button size="lg" variant="outline" className="font-bold px-10 py-7 text-lg border-gray-600 bg-gray-800 text-white hover:bg-gray-700 hover:text-white w-full sm:w-auto group">
                    {t.viewWhitepaper}
                </Button>
            </Link>
        </div>
      </Section>
      
      {/* Sub-hero */}
      <Section className="text-center pt-0 pb-24 md:pb-32">
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {t.subHero1}
            <br />
            {t.subHero2}
        </p>
        <p className="mt-8 text-lg md:text-xl font-semibold text-gray-200 max-w-3xl mx-auto">
            {t.subHero3}
        </p>
        <p className="mt-4 text-gray-400 text-lg">
            {t.subHero4}
        </p>
      </Section>

      {/* The Problem We Solve */}
      <Section className="bg-[#0f172a]/70">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t.problemTitle}</h2>
        <p className="text-lg text-gray-300 leading-relaxed text-center">
            {t.problemText1}
        </p>
        <p className="mt-6 text-xl font-semibold text-white text-center">
            {t.problemText2.split('. ')[0]}.
        </p>
        <p className="mt-2 text-lg text-gray-300 leading-relaxed text-center">
            {t.problemText2.split('. ')[1]}.
        </p>
        <Quote>
            {t.problemQuote}
        </Quote>
      </Section>

      {/* Our Vision */}
      <Section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t.visionTitle}</h2>
        <div className="text-center text-xl md:text-2xl text-gray-200 leading-loose space-y-4">
            <p>{t.visionText1}</p>
            <p>{t.visionText2}</p>
            <p>{t.visionText3}</p>
        </div>
      </Section>

      {/* Our Philosophy */}
       <Section className="bg-[#0f172a]/70">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t.philosophyTitle}</h2>
        <p className="text-center text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            {t.philosophyText1}
        </p>
        <div className="mt-10 max-w-2xl mx-auto glow-card p-8 rounded-2xl">
            <p className="text-center text-lg text-gray-300">
                {t.philosophyText2.split(' — ')[0]} —
                <br />
                <span className="font-bold text-white">{t.philosophyText2.split(' — ')[1]}</span>
            </p>
        </div>
      </Section>

      {/* How It Works */}
      <Section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.howItWorksTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
                <h3 className="text-2xl font-bold pt-4">{t.step1Title}</h3>
                <p className="text-gray-400">{t.step1Desc}</p>
            </div>
            <div className="space-y-3">
                <h3 className="text-2xl font-bold pt-4">{t.step2Title}</h3>
                <p className="text-gray-400">{t.step2Desc}</p>
            </div>
            <div className="space-y-3">
                <h3 className="text-2xl font-bold pt-4">{t.step3Title}</h3>
                <p className="text-gray-400">{t.step3Desc}</p>
            </div>
        </div>
      </Section>
      
      {/* The Ideon Cerebrum (IDN) */}
       <Section className="bg-[#0f172a]/70">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t.tokenTitle}</h2>
        <p className="text-center text-lg text-gray-300 max-w-3xl mx-auto">
            {t.tokenText1.split('. ')[0]}.
            <br/>
            <span className="font-semibold text-white">{t.tokenText1.split('. ')[1]}.</span>
        </p>
        <p className="text-center mt-6 text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t.tokenText1.split('. ')[2]}.
        </p>
        <Quote>
            {t.tokenQuote}
        </Quote>
        <p className="text-center text-gray-300 max-w-2xl mx-auto">
            {t.tokenText2}
        </p>
      </Section>
      
      {/* Global Mission */}
      <Section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.missionTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="glow-card p-6 rounded-xl">
                <p className="text-4xl font-bold text-blue-400">🌍</p>
                <p className="mt-2 text-gray-300">{t.missionStat1}</p>
            </div>
            <div className="glow-card p-6 rounded-xl">
                <p className="text-4xl font-bold text-blue-400">🏛️</p>
                <p className="mt-2 text-gray-300">{t.missionStat2}</p>
            </div>
            <div className="glow-card p-6 rounded-xl">
                <p className="text-4xl font-bold text-blue-400">🤝</p>
                <p className="mt-2 text-gray-300">{t.missionStat3}</p>
            </div>
        </div>
        <p className="mt-12 text-lg text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
            {t.missionText}
        </p>
      </Section>

      {/* Security & Transparency */}
      <Section className="bg-[#0f172a]/70">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">{t.securityTitle}</h2>
        <p className="text-center text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
            {t.securityText}
        </p>
        <Quote>
            {t.securityQuote}
        </Quote>
      </Section>
      
      {/* Join the Evolution */}
      <Section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle}</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            {t.ctaText1.split('. ')[0]}.
            <br/>{t.ctaText1.split('. ')[1]} —
            <br/>{t.ctaText1.split('. ')[2]}.
        </p>
        <div className="my-8 space-y-2 text-xl font-semibold text-blue-300">
            <p>{t.ctaQuote1}</p>
            <p>{t.ctaQuote2}</p>
            <p>{t.ctaQuote3}</p>
        </div>
        <Link to={createPageUrl('CreateProof')}>
            <Button size="lg" className="glow-button font-bold px-10 py-7 text-lg mt-6 group">
                {t.ctaButton} <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
        </Link>
      </Section>

       {/* Final Tagline */}
      <footer className="text-center py-16 border-t border-gray-800">
        <p className="font-semibold text-lg text-gray-400">
            {t.footerTagline}
        </p>
      </footer>
    </div>
  );
}