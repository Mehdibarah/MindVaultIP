import React, { useState } from 'react';
// Stripe checkout disabled - Base44 removed, Supabase functions not yet implemented
import { safeApiCall } from '@/utils/apiErrorHandler';
// safeBase44Call removed - Base44 disabled
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Coins, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe.js. The key will be provided via props.
let stripePromise;
const getStripe = (publishableKey) => {
  if (!stripePromise && publishableKey) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Translations
const translations = {
  en: {
    title: 'Buy Cerebrum Tokens',
    description: 'Purchase Cerebrum (CBR) to participate in the marketplace.',
    quantityLabel: 'Quantity (1 CBR = £0.10)',
    quantityPlaceholder: 'e.g., 500',
    buyButton: 'Buy Now',
    purchasing: 'Processing...',
    minimumPurchase: 'Minimum purchase is 10 tokens.',
    error: 'An error occurred. Please try again.',
  },
  fa: {
    title: 'خرید توکن Cerebrum',
    description: 'برای مشارکت در بازار، توکن Cerebrum (CBR) خریداری کنید.',
    quantityLabel: 'تعداد (هر ۱ توکن = ۰.۱۰ پوند)',
    quantityPlaceholder: 'مثال: ۵۰۰',
    buyButton: 'خرید فوری',
    purchasing: 'در حال پردازش...',
    minimumPurchase: 'حداقل خرید ۱۰ توکن است.',
    error: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
  },
   bal: {
    title: 'Cerebrum ٹوکن بگیج',
    description: 'بازار ءِ تہ ءَ بہر زورگ ءِ واستہ Cerebrum (CBR) ٹوکن بگیج.',
    quantityLabel: 'مقدار (1 CBR = £0.10)',
    quantityPlaceholder: 'مثال، 500',
    buyButton: 'هونئی ءَ بگیل',
    purchasing: 'پروسیسنگ بوگ ءَ اِنت...',
    minimumPurchase: 'کم از کم 10 ٹوکن ءِ گیلگ لوٹیت.',
    error: 'یک نقصے پیش اتک. لطفاً پدا کوشش کن ات.',
  }
};

export default function BuyCerebrumForm({ stripePublishableKey }) {
  const [quantity, setQuantity] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  React.useEffect(() => {
    const handleLanguageChange = () => setLanguage(localStorage.getItem('lang') || 'en');
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = translations[language] || translations.en;

  const handleBuyClick = async () => {
    if (quantity < 10) {
      setError(t.minimumPurchase);
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      // Stripe checkout feature disabled - Base44 removed
      // TODO: Implement Stripe checkout using Supabase Edge Functions or direct Stripe API
      console.warn('Stripe checkout not yet implemented with Supabase');
      throw new Error('Checkout feature not yet available');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const presetAmounts = [100, 250, 500, 1000];

  return (
    <Card className="glow-card max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-yellow-400" />
            <div>
                <CardTitle className="text-white">{t.title}</CardTitle>
                <CardDescription className="text-gray-400">{t.description}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">{t.quantityLabel}</label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value, 10)))}
              placeholder={t.quantityPlaceholder}
              min="10"
              className="bg-[#0B1220] border-gray-600"
            />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presetAmounts.map(amount => (
                  <Button key={amount} variant="outline" onClick={() => setQuantity(amount)}>
                      {amount} CBR
                  </Button>
              ))}
          </div>

          <Button onClick={handleBuyClick} disabled={isLoading || !stripePublishableKey} className="w-full glow-button font-semibold">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.purchasing}
              </>
            ) : (
              t.buyButton
            )}
          </Button>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          {!stripePublishableKey && <p className="text-xs text-yellow-500 text-center">Stripe payments are not configured by the admin yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}