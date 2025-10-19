/**
 * Unit tests for shortenFounderDescription utility
 */

import { shortenFounderDescription, founderPatterns, founderLabels } from '../shortenFounderDescription';

describe('shortenFounderDescription', () => {
  // Test cases for each language
  const testCases = [
    // Persian (fa)
    {
      language: 'fa',
      inputs: [
        'بنیانگذاران و تیم اصلی',
        'بنیان‌گذاران و تیم اصلی',
        'بنیانگذار و تیم',
        'برای بنیان‌گذاران و مشارکت‌کنندگان اولیه',
        'بنیانگذاران و مشارکت‌کنندگان اصلی',
        'بنیانگذار و مشارکت‌کنندگان اولیه'
      ],
      expected: 'برای بنیانگذار'
    },
    // Arabic (ar)
    {
      language: 'ar',
      inputs: [
        'المؤسسون والفريق الرئيسي',
        'المؤسسين والفريق',
        'للمؤسسين والمساهمين الأوائل',
        'المؤسس والفريق الأساسي'
      ],
      expected: 'للمؤسس'
    },
    // English (en)
    {
      language: 'en',
      inputs: [
        'Founders and core team',
        'Founder and team',
        'For founders and early contributors',
        'Founders and main contributors',
        'Founder and early participants'
      ],
      expected: 'For founder'
    },
    // Turkish (tr)
    {
      language: 'tr',
      inputs: [
        'Kurucular ve ekip',
        'Kurucu ve ana ekip',
        'Kurucular ve katkıda bulunanlar',
        'Kurucu ve erken katılımcılar'
      ],
      expected: 'Kurucu için'
    },
    // Russian (ru)
    {
      language: 'ru',
      inputs: [
        'Основатели и команда',
        'Основатель и основная команда',
        'Основатели и участники',
        'Основатель и ранние участники'
      ],
      expected: 'Для основателя'
    },
    // Spanish (es)
    {
      language: 'es',
      inputs: [
        'Fundadores y equipo',
        'Fundador y equipo principal',
        'Fundadores y colaboradores',
        'Fundador y participantes tempranos'
      ],
      expected: 'Para fundador'
    },
    // French (fr)
    {
      language: 'fr',
      inputs: [
        'Fondateurs et équipe',
        'Fondateur et équipe principale',
        'Fondateurs et contributeurs',
        'Fondateur et participants précoces'
      ],
      expected: 'Pour le fondateur'
    },
    // German (de)
    {
      language: 'de',
      inputs: [
        'Gründer und Team',
        'Gründerinnen und Hauptteam',
        'Gründer und Mitwirkende',
        'Gründer und frühe Teilnehmer'
      ],
      expected: 'Für Gründer'
    }
  ];

  // Test each language
  testCases.forEach(({ language, inputs, expected }) => {
    describe(`${language} language`, () => {
      inputs.forEach((input) => {
        test(`should convert "${input}" to "${expected}"`, () => {
          expect(shortenFounderDescription(input, language)).toBe(expected);
        });
      });
    });
  });

  // Test non-founder descriptions (should remain unchanged)
  describe('Non-founder descriptions', () => {
    const nonFounderInputs = [
      'صندوق سفارت استعداد',
      'ذخیره پلتفرم MindVaultIP',
      'توزیع رایگان عمومی',
      'Talent Embassy Fund',
      'Platform Reserve',
      'Public Distribution',
      'صندوق سفارت استعداد جهانی',
      'عملیات پلتفرم، تحقیق و توسعه'
    ];

    nonFounderInputs.forEach((input) => {
      test(`should keep "${input}" unchanged`, () => {
        expect(shortenFounderDescription(input, 'fa')).toBe(input);
        expect(shortenFounderDescription(input, 'en')).toBe(input);
      });
    });
  });

  // Test fallback behavior
  describe('Fallback behavior', () => {
    test('should fallback to English for unsupported locale', () => {
      const input = 'Founders and core team';
      expect(shortenFounderDescription(input, 'unsupported')).toBe('For founder');
    });

    test('should use document.documentElement.lang when available', () => {
      // Mock document.documentElement.lang
      const originalLang = document.documentElement.lang;
      document.documentElement.lang = 'en';
      
      const input = 'Founders and core team';
      expect(shortenFounderDescription(input)).toBe('For founder');
      
      // Restore original
      document.documentElement.lang = originalLang;
    });

    test('should fallback to en when document is not available', () => {
      // This test would need to be run in a Node.js environment
      // where document is not available
      const input = 'Founders and core team';
      expect(shortenFounderDescription(input, 'en')).toBe('For founder');
    });
  });

  // Test regex patterns directly
  describe('Regex patterns', () => {
    test('Persian patterns should match correctly', () => {
      const pattern = founderPatterns.fa;
      expect(pattern.test('بنیانگذاران و تیم اصلی')).toBe(true);
      expect(pattern.test('بنیان‌گذاران و تیم اصلی')).toBe(true);
      expect(pattern.test('بنیانگذار و تیم')).toBe(true);
      expect(pattern.test('برای بنیان‌گذاران و مشارکت‌کنندگان اولیه')).toBe(true);
      expect(pattern.test('صندوق سفارت استعداد')).toBe(false);
    });

    test('English patterns should match correctly', () => {
      const pattern = founderPatterns.en;
      expect(pattern.test('Founders and core team')).toBe(true);
      expect(pattern.test('Founder and team')).toBe(true);
      expect(pattern.test('For founders and early contributors')).toBe(true);
      expect(pattern.test('Platform Reserve')).toBe(false);
    });
  });

  // Test labels
  describe('Labels', () => {
    test('should have correct labels for all languages', () => {
      expect(founderLabels.fa).toBe('برای بنیانگذار');
      expect(founderLabels.ar).toBe('للمؤسس');
      expect(founderLabels.en).toBe('For founder');
      expect(founderLabels.tr).toBe('Kurucu için');
      expect(founderLabels.ru).toBe('Для основателя');
      expect(founderLabels.es).toBe('Para fundador');
      expect(founderLabels.fr).toBe('Pour le fondateur');
      expect(founderLabels.de).toBe('Für Gründer');
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    test('should handle empty string', () => {
      expect(shortenFounderDescription('', 'en')).toBe('');
    });

    test('should handle null/undefined input gracefully', () => {
      expect(shortenFounderDescription(null as any, 'en')).toBe(null);
      expect(shortenFounderDescription(undefined as any, 'en')).toBe(undefined);
    });

    test('should handle case variations', () => {
      expect(shortenFounderDescription('FOUNDERS AND TEAM', 'en')).toBe('For founder');
      expect(shortenFounderDescription('founders and team', 'en')).toBe('For founder');
      expect(shortenFounderDescription('Founders And Team', 'en')).toBe('For founder');
    });

    test('should handle extra whitespace', () => {
      expect(shortenFounderDescription('  بنیانگذاران و تیم اصلی  ', 'fa')).toBe('برای بنیانگذار');
      expect(shortenFounderDescription('  Founders and core team  ', 'en')).toBe('For founder');
    });
  });
});
