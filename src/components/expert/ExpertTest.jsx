
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Award, FileText, Lightbulb, Wrench, Loader2 } from 'lucide-react';
import { generateExpertTestQuestion } from '@/api/functions';

const translations = {
  en: {
    testTitle: "Expert Qualification Test",
    testDescription: "Review these AI-generated sample proofs and rate them. Your analysis will be compared against expert standards.",
    question: "Question",
    of: "of",
    loadingQuestions: "Generating unique test questions from global patent data...",
    noveltyScore: "Novelty Score (1-10)",
    noveltyDesc: "How new and original is this idea?",
    utilityScore: "Utility Score (1-10)",
    utilityDesc: "How useful and practical is this invention?",
    inventiveScore: "Inventive Step Score (1-10)",
    inventiveDesc: "How non-obvious is this solution?",
    overallDecision: "Overall Decision",
    approve: "Approve",
    reject: "Reject",
    reasoning: "Reasoning",
    reasoningDesc: "Explain your decision in 2-3 sentences",
    nextQuestion: "Next Question",
    submitTest: "Submit Test",
    processing: "Processing Results...",
    testPassed: "Congratulations! You passed the test!",
    testFailed: "Test failed. Please study more and try again later.",
    expertStatusGranted: "You have been granted expert status.",
    score: "Your Score",
    passingScore: "Passing Score: 75%",
    tryAgainLater: "You can retake the test in 24 hours.",
    loadingError: "Failed to load the question. Please try again.",
  },
  fa: {
    testTitle: "آزمون صلاحیت متخصص",
    testDescription: "این گواهی‌های نمونه تولید شده توسط هوش مصنوعی را بررسی و امتیازدهی کنید. تحلیل شما با استانداردهای متخصصان مقایسه خواهد شد.",
    question: "سوال",
    of: "از",
    loadingQuestions: "در حال تولید سوالات منحصربه‌فرد آزمون از داده‌های جهانی ثبت اختراعات...",
    noveltyScore: "امتیاز نوآوری (۱-۱۰)",
    noveltyDesc: "این ایده چقدر جدید و اصیل است؟",
    utilityScore: "امتیاز کاربرد (۱-۱۰)",
    utilityDesc: "این اختراع چقدر مفید و عملی است؟",
    inventiveScore: "امتیاز گام ابتکاری (۱-۱۰)",
    inventiveDesc: "این راه‌حل چقدر غیرمنتظره است؟",
    overallDecision: "تصمیم کلی",
    approve: "تایید",
    reject: "رد",
    reasoning: "استدلال",
    reasoningDesc: "تصمیم خود را در ۲-۳ جمله توضیح دهید",
    nextQuestion: "سوال بعدی",
    submitTest: "ارسال آزمون",
    processing: "در حال پردازش نتایج...",
    testPassed: "تبریک! شما در آزمون قبول شدید!",
    testFailed: "آزمون ناموفق. لطفاً بیشتر مطالعه کنید و بعداً دوباره امتحان کنید.",
    expertStatusGranted: "وضعیت متخصص به شما اعطا شد.",
    score: "امتیاز شما",
    passingScore: "نمره قبولی: ۷۵٪",
    tryAgainLater: "می‌توانید ۲۴ ساعت دیگر دوباره آزمون دهید.",
    loadingError: "بارگذاری سوال ناموفق بود. لطفاً دوباره تلاش کنید.",
  },
  tr: {
    testTitle: "Uzman Yeterlilik Testi",
    testDescription: "Yapay zeka tarafından oluşturulan bu örnek kanıtları inceleyin ve derecelendirin. Analiziniz uzman standartlarına göre karşılaştırılacaktır.",
    question: "Soru",
    of: "toplam", // e.g. "Soru 1 toplam 5" for "Question 1 of 5"
    loadingQuestions: "Küresel patent verilerinden benzersiz test soruları oluşturuluyor...",
    noveltyScore: "Yenilik Skoru (1-10)",
    noveltyDesc: "Bu fikir ne kadar yeni ve orijinal?",
    utilityScore: "Kullanışlılık Skoru (1-10)",
    utilityDesc: "Bu buluş ne kadar faydalı ve pratik?",
    inventiveScore: "Buluş Basamağı Skoru (1-10)",
    inventiveDesc: "Bu çözüm ne kadar bariz değil?",
    overallDecision: "Genel Karar",
    approve: "Onayla",
    reject: "Reddet",
    reasoning: "Gerekçe",
    reasoningDesc: "Kararınızı 2-3 cümleyle açıklayın",
    nextQuestion: "Sonraki Soru",
    submitTest: "Testi Gönder",
    processing: "Sonuçlar İşleniyor...",
    testPassed: "Tebrikler! Testi geçtiniz!",
    testFailed: "Test başarısız oldu. Lütfen daha fazla çalışın ve daha sonra tekrar deneyin.",
    expertStatusGranted: "Uzman statüsü size verildi.",
    score: "Puanınız",
    passingScore: "Geçme Notu: %75",
    tryAgainLater: "Testi 24 saat sonra tekrar deneyebilirsiniz.",
    loadingError: "Soru yüklenemedi. Lütfen tekrar deneyin.",
  }
};

const TOTAL_QUESTIONS = 5;

export default function ExpertTest({ onTestComplete, language = 'en' }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  const t = translations[language];
  const isRTL = language === 'fa';

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoadingQuestions(true);
      const generatedQuestions = [];
      try {
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
          const response = await generateExpertTestQuestion({ language: language });
          
          // بررسی ساختار پاسخ و debug کردن
          console.log('Response from generateExpertTestQuestion:', response);
          
          // تلاش برای دسترسی به داده‌ها با ساختارهای مختلف
          let questionData = null;
          
          if (response && response.data) {
            questionData = response.data;
          } else if (response && response.title) {
            questionData = response;
          } else if (response && typeof response === 'object') {
            // احتمالاً پاسخ در یک wrapper دیگر است
            const keys = Object.keys(response);
            if (keys.length > 0) {
              const firstKey = keys[0];
              if (response[firstKey] && response[firstKey].title) {
                questionData = response[firstKey];
              }
            }
          }
          
          if (questionData && questionData.title && questionData.description && questionData.correctScores) {
            generatedQuestions.push(questionData);
          } else {
            console.error("Invalid question structure received:", response);
          }
        }
        
        if (generatedQuestions.length === 0) {
          throw new Error("No valid questions generated");
        }
        
        setQuestions(generatedQuestions);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        alert(t.loadingError);
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [language, t.loadingError]);

  const handleAnswerChange = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        ...prev[currentQuestionIndex],
        [field]: value
      }
    }));
  };

  const isCurrentStepComplete = () => {
    const currentAnswer = answers[currentQuestionIndex];
    return (
      currentAnswer?.novelty &&
      currentAnswer?.utility &&
      currentAnswer?.inventive &&
      currentAnswer?.overall &&
      currentAnswer?.reasoning?.trim().length > 0
    );
  };

  const calculateScore = () => {
    let totalObtainedScore = 0;
    const scorePerProof = 40; // 10 points for each of Novelty, Utility, Inventive, Overall
    const maxPossibleScore = questions.length * scorePerProof;

    questions.forEach((proof, index) => {
      const userAnswer = answers[index];
      if (!userAnswer) return;

      const correct = proof.correctScores;
      // Score for novelty, utility, inventive: 10 - absolute difference from correct score
      totalObtainedScore += Math.max(0, 10 - Math.abs((userAnswer.novelty || 0) - correct.novelty));
      totalObtainedScore += Math.max(0, 10 - Math.abs((userAnswer.utility || 0) - correct.utility));
      totalObtainedScore += Math.max(0, 10 - Math.abs((userAnswer.inventive || 0) - correct.inventive));
      
      // Score for overall decision: 10 if matches, 0 otherwise
      if (userAnswer.overall === correct.overall) {
        totalObtainedScore += 10;
      }
    });

    return Math.round((totalObtainedScore / maxPossibleScore) * 100);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    const finalScore = calculateScore();
    const passed = finalScore >= 75; // Passing score is 75%
    setIsProcessing(false);
    setTestResult({ passed, score: finalScore });
    onTestComplete(passed, finalScore);
  };

  if (isLoadingQuestions) {
    return (
      <div className="text-center p-8 flex flex-col items-center justify-center min-h-[400px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <Loader2 className="w-12 h-12 text-blue-400 mx-auto animate-spin" />
        <h3 className="text-xl font-bold text-white mt-4">{t.loadingQuestions}</h3>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="text-center p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <Brain className="w-16 h-16 text-blue-400 mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-white mt-2">{t.processing}</h3>
      </div>
    );
  }

  if (testResult) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 max-w-md mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        {testResult.passed ? <CheckCircle className="w-16 h-16 text-green-400 mx-auto" /> : <XCircle className="w-16 h-16 text-red-400 mx-auto" />}
        <h3 className="text-2xl font-bold text-white mt-4">{testResult.passed ? t.testPassed : t.testFailed}</h3>
        <p className="text-gray-300 mb-4">{testResult.passed ? t.expertStatusGranted : t.tryAgainLater}</p>
        <div className={`${testResult.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} rounded-lg p-4`}>
          <p>{t.score}: {testResult.score}%</p><p className="text-xs">{t.passingScore}</p>
        </div>
      </motion.div>
    );
  }

  if (questions.length === 0) {
     return <div className="text-center p-8 text-red-400">{t.loadingError}</div>;
  }

  const currentProof = questions[currentQuestionIndex];

  // اگر سوال فعلی لود نشده باشد، یک حالت لودینگ موقت نشان بده
  if (!currentProof) {
      return (
          <div className="text-center p-8 flex flex-col items-center justify-center min-h-[400px]" dir={isRTL ? 'rtl' : 'ltr'}>
              <Loader2 className="w-12 h-12 text-blue-400 mx-auto animate-spin" />
          </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><Brain className="w-8 h-8 text-white" /></div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">{t.testTitle}</h1>
        <p className="text-gray-400 mt-2">{t.testDescription}</p>
      </motion.div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-white"><p>{t.question} {currentQuestionIndex + 1} {t.of} {questions.length}</p></div>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="w-full" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: isRTL ? -50 : 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRTL ? 50 : -50 }} transition={{ duration: 0.3 }}>
          <Card className="glow-card">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-white text-xl leading-snug">{currentProof.title}</CardTitle>
                  <p className="text-gray-400 text-sm mt-2">{currentProof.description}</p>
                </div>
                <FileText className="w-6 h-6 text-blue-400 flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-lg font-semibold text-white flex items-center gap-2 mb-2"><Lightbulb className="w-5 h-5 text-yellow-400" /> {t.noveltyScore}</Label>
                <p className="text-sm text-gray-400 mb-3">{t.noveltyDesc}</p>
                <RadioGroup onValueChange={(v) => handleAnswerChange('novelty', parseInt(v))} value={answers[currentQuestionIndex]?.novelty?.toString()} className="flex flex-wrap gap-x-4 gap-y-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (<div key={num} className="flex items-center space-x-2"><RadioGroupItem value={num.toString()} id={`novelty-${num}`} /><Label htmlFor={`novelty-${num}`} className="text-white">{num}</Label></div>))}
                </RadioGroup>
              </div>
              <div>
                <Label className="text-lg font-semibold text-white flex items-center gap-2 mb-2"><Wrench className="w-5 h-5 text-green-400" /> {t.utilityScore}</Label>
                <p className="text-sm text-gray-400 mb-3">{t.utilityDesc}</p>
                <RadioGroup onValueChange={(v) => handleAnswerChange('utility', parseInt(v))} value={answers[currentQuestionIndex]?.utility?.toString()} className="flex flex-wrap gap-x-4 gap-y-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (<div key={num} className="flex items-center space-x-2"><RadioGroupItem value={num.toString()} id={`utility-${num}`} /><Label htmlFor={`utility-${num}`} className="text-white">{num}</Label></div>))}
                </RadioGroup>
              </div>
              <div>
                <Label className="text-lg font-semibold text-white flex items-center gap-2 mb-2"><Brain className="w-5 h-5 text-purple-400" /> {t.inventiveScore}</Label>
                <p className="text-sm text-gray-400 mb-3">{t.inventiveDesc}</p>
                <RadioGroup onValueChange={(v) => handleAnswerChange('inventive', parseInt(v))} value={answers[currentQuestionIndex]?.inventive?.toString()} className="flex flex-wrap gap-x-4 gap-y-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (<div key={num} className="flex items-center space-x-2"><RadioGroupItem value={num.toString()} id={`inventive-${num}`} /><Label htmlFor={`inventive-${num}`} className="text-white">{num}</Label></div>))}
                </RadioGroup>
              </div>
              <div>
                <Label className="text-lg font-semibold text-white flex items-center gap-2 mb-2"><Award className="w-5 h-5 text-blue-400" /> {t.overallDecision}</Label>
                <RadioGroup onValueChange={(v) => handleAnswerChange('overall', v)} value={answers[currentQuestionIndex]?.overall} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="approve" id="approve" /><Label htmlFor="approve" className="text-white">{t.approve}</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="reject" id="reject" /><Label htmlFor="reject" className="text-white">{t.reject}</Label></div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="reasoning" className="text-lg font-semibold text-white flex items-center gap-2 mb-2">{t.reasoning}</Label>
                <Textarea id="reasoning" value={answers[currentQuestionIndex]?.reasoning || ''} onChange={(e) => handleAnswerChange('reasoning', e.target.value)} placeholder={t.reasoningDesc} className="bg-[#0B1220] border-gray-600 text-white" rows={3} />
              </div>
              <Button onClick={handleNext} disabled={!isCurrentStepComplete()} className="w-full glow-button text-white font-semibold">
                {currentQuestionIndex === questions.length - 1 ? t.submitTest : t.nextQuestion}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
