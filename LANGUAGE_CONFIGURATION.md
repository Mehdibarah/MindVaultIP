# Language Configuration - English as Default

## Overview
The MindVaultIP platform now defaults to English ("en") as the primary language. Users can switch to other languages using the language switcher, and their preference is saved in localStorage.

## Implementation Details

### 1. Default Language Configuration
- **Default Language**: English ("en")
- **Fallback Language**: English ("en")
- **Storage**: User preferences saved in `localStorage.getItem('lang')`

### 2. Centralized Configuration
**File**: `src/utils/languageConfig.js`

```javascript
export const DEFAULT_LANGUAGE = 'en';
export const FALLBACK_LANGUAGE = 'en';

// Get current language (defaults to English)
export function getCurrentLanguage() {
  return localStorage.getItem('lang') || DEFAULT_LANGUAGE;
}

// Set language and save preference
export function setLanguage(language) {
  localStorage.setItem('lang', language);
  document.documentElement.lang = language;
  document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
  window.dispatchEvent(new Event('languageChange'));
}
```

### 3. App Initialization
**File**: `src/App.jsx`

```javascript
import { initializeLanguage } from "@/utils/languageConfig"

function App() {
  useEffect(() => {
    initializeLanguage(); // Sets English as default on app startup
  }, []);
  
  return (
    <WalletProvider>
      <Pages />
      <Toaster />
    </WalletProvider>
  )
}
```

### 4. Component Implementation Pattern
All components follow this pattern:

```javascript
const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

useEffect(() => {
  const handleLanguageChange = () => {
    setLanguage(localStorage.getItem('lang') || 'en');
  };
  window.addEventListener('languageChange', handleLanguageChange);
  return () => window.removeEventListener('languageChange', handleLanguageChange);
}, []);
```

### 5. Language Switcher Implementation
**File**: `src/pages/Layout.jsx`

```javascript
const toggleLanguage = (lang) => {
  setLanguage(lang);
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
  window.dispatchEvent(new Event('languageChange'));
};
```

## Supported Languages

| Code | Language | RTL |
|------|----------|-----|
| en   | English  | No  |
| fa   | فارسی   | Yes |
| ar   | العربية | Yes |
| tr   | Türkçe   | No  |
| ru   | Русский  | No  |
| es   | Español  | No  |
| fr   | Français | No  |
| de   | Deutsch  | No  |

## RTL Languages
- Persian (fa)
- Arabic (ar)
- Urdu (ur)
- Balochi (bal)

## Updated Components

### 1. AI Mentor (`src/pages/AIMentor.jsx`)
- **Before**: Defaulted to Persian ('fa')
- **After**: Defaults to English ('en')
- **Initial Message**: Now in English by default
- **Language Toggle**: Saves preference to localStorage

### 2. Founder Description Utility (`src/utils/shortenFounderDescription.ts`)
- **Before**: Defaulted to Persian ('fa')
- **After**: Defaults to English ('en')
- **Fallback**: Uses English patterns when language not supported

### 3. All Other Components
- Already correctly configured to use `localStorage.getItem('lang') || 'en'`
- No changes needed

## User Experience

### First-Time Users
1. **App Load**: Interface displays in English
2. **Language Switcher**: Available in navigation
3. **Preference Save**: Choice saved to localStorage
4. **Future Visits**: User's preferred language loads automatically

### Language Switching
1. **Click Language Switcher**: Available in header/navigation
2. **Select Language**: Choose from supported languages
3. **Instant Update**: Interface updates immediately
4. **Preference Saved**: Choice persists across sessions

## Technical Implementation

### localStorage Key
```javascript
localStorage.getItem('lang') // Returns 'en' by default
localStorage.setItem('lang', 'fa') // Saves user preference
```

### Document Attributes
```javascript
document.documentElement.lang = 'en'; // Language attribute
document.documentElement.dir = 'ltr'; // Text direction
```

### Event System
```javascript
// Dispatch when language changes
window.dispatchEvent(new Event('languageChange'));

// Listen for language changes
window.addEventListener('languageChange', handleLanguageChange);
```

## Testing

### Manual Testing
1. **Clear localStorage**: `localStorage.clear()`
2. **Reload App**: Should display in English
3. **Switch Language**: Should save preference
4. **Reload Again**: Should display in chosen language

### Automated Testing
```javascript
// Test default language
expect(getCurrentLanguage()).toBe('en');

// Test language switching
setLanguage('fa');
expect(localStorage.getItem('lang')).toBe('fa');
expect(getCurrentLanguage()).toBe('fa');
```

## Migration Notes

### For Existing Users
- **Existing Preferences**: Preserved in localStorage
- **No Data Loss**: User language preferences maintained
- **New Users**: Default to English instead of Persian

### For Developers
- **Consistent Pattern**: All components use same language logic
- **Centralized Config**: Language settings in one place
- **Easy Maintenance**: Single source of truth for language defaults

## Browser Compatibility
- **localStorage**: Supported in all modern browsers
- **Event System**: Standard DOM events
- **Document Attributes**: Universal browser support

## Performance
- **Minimal Impact**: Language check on app load only
- **Efficient Updates**: Event-driven language changes
- **No Re-renders**: Components update only when needed

The platform now provides a consistent English-first experience while maintaining full multilingual support and user preference persistence.

