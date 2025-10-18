
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Tag, Loader2 } from 'lucide-react';

const translations = {
    en: {
        title: 'Set Sale Price: "{title}"',
        description: 'Make your proof available for purchase on the marketplace. Only AI-approved proofs can be sold.',
        notApprovedWarning: '⚠️ Only AI-approved proofs can be put for sale. Your proof needs to be approved first.',
        listForSale: 'List for Sale',
        priceLabel: 'Sale Price (IDN Tokens)',
        pricePlaceholder: 'Enter price in IDN',
        pricingTipsTitle: '💡 Pricing Tips:',
        tip1: '• Consider your proof\'s uniqueness and market potential',
        tip2: '• Look at similar proofs to set competitive pricing',
        tip3: '• You can change the price anytime',
        tip4: '• Higher AI scores typically warrant higher prices', // Added missing EN translation for tip4 for consistency
        cancel: 'Cancel',
        listForSaleButton: 'List for Sale', // Differentiating button text from switch label
        removeFromSaleButton: 'Remove from Sale', // Differentiating button text from switch label
        submitting: 'Submitting...',
        validationError: 'Please enter a valid price greater than 0 IDN.',
        successForSale: '✅ Your proof is now for sale at {price} IDN tokens!',
        successRemoved: '✅ Your proof has been removed from sale.',
        errorUpdating: '❌ Error updating proof. Please try again.',
        buttonTextSetPrice: 'Set Price',
        buttonTextPrice: '{price} IDN'
    },
    de: {
        title: 'Verkaufspreis festlegen: "{title}"',
        description: 'Machen Sie Ihren Nachweis auf dem Marktplatz zum Kauf verfügbar. Nur KI-genehmigte Nachweise können verkauft werden.',
        notApprovedWarning: '⚠️ Nur KI-genehmigte Nachweise können zum Verkauf angeboten werden. Ihr Nachweis muss zuerst genehmigt werden.',
        listForSale: 'Zum Verkauf anbieten',
        priceLabel: 'Verkaufspreis (IDN-Token)',
        pricePlaceholder: 'Preis in IDN eingeben',
        pricingTipsTitle: '💡 Preistipps:',
        tip1: '• Berücksichtigen Sie die Einzigartigkeit und das Marktpotenzial Ihres Nachweises',
        tip2: '• Schauen Sie sich ähnliche Nachweise an, um wettbewerbsfähige Preise festzulegen',
        tip3: '• Sie können den Preis jederzeit ändern',
        tip4: '• Höhere KI-Scores rechtfertigen in der Regel höhere Preise',
        cancel: 'Abbrechen',
        listForSaleButton: 'Zum Verkauf anbieten',
        removeFromSaleButton: 'Vom Verkauf entfernen',
        submitting: 'Wird übermittelt...',
        validationError: 'Bitte geben Sie einen gültigen Preis größer als 0 IDN ein.',
        successForSale: '✅ Ihr Nachweis wird jetzt für {price} IDN-Token zum Verkauf angeboten!',
        successRemoved: '✅ Ihr Nachweis wurde vom Verkauf entfernt.',
        errorUpdating: '❌ Fehler beim Aktualisieren des Nachweises. Bitte versuchen Sie es erneut.',
        buttonTextSetPrice: 'Preis festlegen',
        buttonTextPrice: '{price} IDN'
    },
    bal: {
        title: 'بہا ءِ قیمت ءَ مقرر کن: "{title}"',
        description: 'وتی گواهی ءَ بازار ءِ تہ ءَ بہا کنگ ءِ واست ءَ دسترس کن. فقط AI ءِ منظور بوتگیں گواهی بہا کورتگ بیت.',
        notApprovedWarning: '⚠️ فقط AI ءِ منظور بوتگیں گواهی بہا کنگ ءِ واست ءَ لیست کورتگ بنت. تئی گواهی ءَ اول منظور بیئگ لوٹیت.',
        listForSale: 'بہا کنگ ءِ واست ءَ لیست کن',
        priceLabel: 'بہا ءِ قیمت (IDN ٹوکن)',
        pricePlaceholder: 'IDN ءِ تہ ءَ قیمت داخل کن',
        pricingTipsTitle: '💡 قیمت دیگ ءِ ٹپس:',
        tip1: '• وتی گواهی ءِ انفرادیت ءُ بازاری صلاحیت ءَ بچار',
        tip2: '• مقابلتی قیمت دیگ ءِ واست ءَ مشابہیں گواهی ءَ بچار',
        tip3: '• تئو ہر وخت ءَ قیمت ءَ بدل کُت کناں',
        tip4: '• گیشتریں AI اسکور عام طور ءَ گیشتریں قیمتانی ضمانت دنت',
        cancel: 'منسوخ کن',
        listForSaleButton: 'بہا کنگ ءِ واست ءَ لیست کن',
        removeFromSaleButton: 'بہا ءَ چہ در کن',
        submitting: 'جمع کنگ ءَ اِنت...',
        validationError: 'لطفاً یک معتبریں قیمت کہ 0 IDN ءَ چہ گیشتر بہ بیت داخل کن.',
        successForSale: '✅ تئی گواهی مرچی {price} IDN ٹوکن ءِ قیمت ءَ بہا کنگ ءَ اِنت!',
        successRemoved: '✅ تئی گواهی بہا ءَ چہ در کورتگ بوت.',
        errorUpdating: '❌ گواهی ءِ اپڈیٹ کنگ ءِ تہ ءَ نقص. لطفاً پدا کوشش کن.',
        buttonTextSetPrice: 'قیمت مقرر کن',
        buttonTextPrice: '{price} IDN'
    }
};

// Assuming English as default or determined by context
const currentLang = 'en'; // This would typically come from a context or prop
const t = translations[currentLang];

export default function SetPriceButton({ proof, onUpdate, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isForSale, setIsForSale] = useState(proof.is_for_sale || false);
  const [salePrice, setSalePrice] = useState(proof.sale_price || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    if (isForSale && (!salePrice || parseFloat(salePrice) <= 0)) {
      alert(t.validationError);
      return;
    }

    setIsUpdating(true);
    try {
      const updatedData = {
        is_for_sale: isForSale,
        sale_price: isForSale ? parseFloat(salePrice) : null
      };

      const updatedProof = await base44.entities.Proof.update(proof.id, updatedData);
      onUpdate(updatedProof);
      setIsOpen(false);
      
      if (isForSale) {
        alert(t.successForSale.replace('{price}', salePrice));
      } else {
        alert(t.successRemoved);
      }
    } catch (error) {
      console.error('Error updating proof price:', error);
      alert(t.errorUpdating);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
          disabled={disabled}
        >
          <Tag className="w-4 h-4 mr-2" />
          {proof.is_for_sale ? t.buttonTextPrice.replace('{price}', proof.sale_price) : t.buttonTextSetPrice}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a2332] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{t.title.replace('{title}', proof.title)}</DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>
        
        {proof.validation_status !== 'ai_approved' ? (
          <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-400">
              {t.notApprovedWarning}
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="for-sale">{t.listForSale}</Label>
              <Switch
                id="for-sale"
                checked={isForSale}
                onCheckedChange={setIsForSale}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            {isForSale && (
              <div>
                <Label htmlFor="price">{t.priceLabel}</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="price"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder={t.pricePlaceholder}
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="pl-10 bg-[#0B1220] border-gray-600"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {/* Hardcoded for now, can be added to translations if needed */}
                  Recommended: 1-100 IDN for ideas, 10-500 IDN for inventions
                </p>
              </div>
            )}

            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <h4 className="font-medium text-blue-400 mb-2">{t.pricingTipsTitle}</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>{t.tip1}</li>
                <li>{t.tip2}</li>
                <li>{t.tip3}</li>
                <li>{t.tip4}</li>
              </ul>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t.cancel}
          </Button>
          {proof.validation_status === 'ai_approved' && (
            <Button 
              onClick={handleSubmit} 
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isForSale ? t.listForSaleButton : t.removeFromSaleButton}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
