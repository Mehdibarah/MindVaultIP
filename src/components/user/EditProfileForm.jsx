
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Loader2, User as UserIcon } from 'lucide-react';
import { UploadFile } from '@/api/integrations';

const formTranslations = {
  en: {
    title: 'Edit Your Profile',
    subtitle: 'Build your professional identity on MindVaultIP.',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Your name or professional alias',
    bioLabel: 'Bio / Short Description',
    bioPlaceholder: 'Tell investors about yourself, your skills, and your vision.',
    specializationLabel: 'Fields of Expertise (comma-separated)',
    specializationPlaceholder: 'e.g., AI, Biotech, Mechanical Engineering',
    profileImageLabel: 'Profile Image',
    profileImageSubtext: 'Upload a new profile image.',
    changeImageButton: 'Change Image',
    saveButton: 'Save Changes',
    cancelButton: 'Cancel',
    saving: 'Saving...',
    uploading: 'Uploading...'
  },
  fa: {
    title: 'پروفایل خود را ویرایش کنید',
    subtitle: 'هویت حرفه‌ای خود را در MindVaultIP بسازید.',
    fullNameLabel: 'نام کامل',
    fullNamePlaceholder: 'نام شما یا نام مستعار حرفه‌ای',
    bioLabel: 'بیوگرافی / توضیحات کوتاه',
    bioPlaceholder: 'به سرمایه‌گذاران درباره خود، مهارت‌ها و دیدگاهتان بگویید.',
    specializationLabel: 'زمینه‌های تخصص (با کاما جدا کنید)',
    specializationPlaceholder: 'مانند: هوش مصنوعی، بیوتکنولوژی، مهندسی مکانیک',
    profileImageLabel: 'تصویر پروفایل',
    profileImageSubtext: 'یک تصویر پروفایل جدید بارگذاری کنید.',
    changeImageButton: 'تغییر تصویر',
    saveButton: 'ذخیره تغییرات',
    cancelButton: 'انصراف',
    saving: 'در حال ذخیره...',
    uploading: 'در حال بارگذاری...'
  },
  tr: {
    title: 'Profilini Düzenle',
    subtitle: 'MindVaultIP üzerinde profesyonel kimliğinizi oluşturun.',
    fullNameLabel: 'Tam Ad',
    fullNamePlaceholder: 'Adınız veya profesyonel takma adınız',
    bioLabel: 'Biyografi / Kısa Açıklama',
    bioPlaceholder: 'Yatırımcılara kendinizden, becerilerinizden ve vizyonunuzdan bahsedin.',
    specializationLabel: 'Uzmanlık Alanları (virgülle ayrılmış)',
    specializationPlaceholder: 'örn: Yapay Zeka, Biyoteknoloji, Makine Mühendisliği',
    profileImageLabel: 'Profil Resmi',
    profileImageSubtext: 'Yeni bir profil resmi yükleyin.',
    changeImageButton: 'Resmi Değiştir',
    saveButton: 'Değişiklikleri Kaydet',
    cancelButton: 'İptal',
    saving: 'Kaydediliyor...',
    uploading: 'Yükleniyor...'
  }
};

export default function EditProfileForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    bio: user.bio || '',
    profile_image: user.profile_image || '',
    specialization: user.specialization && Array.isArray(user.specialization) ? user.specialization : []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('lang') || 'en');
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        const { file_url } = await UploadFile({ file });
        setFormData(prev => ({ ...prev, profile_image: file_url }));
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert("Could not upload image. Please try again.");
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updateData = {
        ...formData,
        specialization: formData.specialization.map(s => s.trim()).filter(Boolean),
        wallet_address: user.wallet_address
      };

      let updatedUser;
      if (user.is_placeholder) {
        const users = await User.list();
        const existing = users.find(u => u.wallet_address && u.wallet_address.toLowerCase() === user.wallet_address.toLowerCase());
        if(existing) {
             updatedUser = await User.update(existing.id, updateData);
        } else {
             updatedUser = await User.create(updateData);
        }
      } else {
        updatedUser = await User.update(user.id, updateData);
      }
      onSave(updatedUser);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Could not save profile. Please try again.");
    }
    setIsSaving(false);
  };

  const t = formTranslations[language] || formTranslations.en;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
      dir={language === 'fa' || language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">{t.title}</h2>
        <p className="text-gray-400">{t.subtitle}</p>
      </div>
      <form onSubmit={handleSubmit} className="glow-card p-8 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-white">{t.fullNameLabel}</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder={t.fullNamePlaceholder}
              className="mt-2 bg-[#0B1220] border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization" className="text-white">{t.specializationLabel}</Label>
            <Input
              id="specialization"
              name="specialization"
              value={formData.specialization.join(', ')}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value.split(',').map(s => s.trim()) })}
              placeholder={t.specializationPlaceholder}
              className="mt-2 bg-[#0B1220] border-gray-600"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-white">{t.bioLabel}</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder={t.bioPlaceholder}
            className="mt-2 bg-[#0B1220] border-gray-600 min-h-[100px]"
            rows={3}
          />
        </div>
        <div className="space-y-2">
            <Label className="text-white">{t.profileImageLabel}</Label>
            <div className="flex items-center gap-4">
                 <div className="w-20 h-20 bg-[#2F80FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  {formData.profile_image ? (
                    <img src={formData.profile_image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-10 h-10 text-[#2F80FF]" />
                  )}
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('profile-image-upload').click()}
                    className="border-gray-600 text-gray-300"
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t.uploading}
                      </>
                    ) : t.changeImageButton}
                  </Button>
                  <input type="file" id="profile-image-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <p className="text-xs text-gray-400 mt-2">{t.profileImageSubtext}</p>
                </div>
            </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-gray-300 hover:bg-gray-800">
            {t.cancelButton}
          </Button>
          <Button type="submit" disabled={isSaving || isUploadingImage} className="glow-button">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.saving}
              </>
            ) : t.saveButton}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
