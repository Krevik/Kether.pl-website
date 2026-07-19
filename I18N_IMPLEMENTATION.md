# Internationalization (i18n) Implementation

## Overview

This project now supports full internationalization with English, Polish, and Silesian languages, featuring automatic language detection, persistent language preferences, and a user-friendly language switcher.

## Features

### ✅ **Supported Languages**
- **English (en)** - Default language
- **Polish (pl)** - Full translation support
- **Silesian (szl)** - Full translation support (Ślōnskŏ); browser `szl-PL` maps to `szl`

### ✅ **Key Features**
- **Automatic Language Detection**: Detects user's browser language
- **Persistent Language Storage**: Remembers user's language preference
- **Language Switcher**: Easy language switching in the navigation
- **Fallback Support**: Falls back to Polish then English for missing Silesian keys; English otherwise
- **Type-Safe Translations**: Custom hooks for type-safe translation usage
- **Dynamic Loading**: Translations load efficiently with code splitting

## Technical Implementation

### **Dependencies**
```json
{
  "i18next": "25.6.0",
  "react-i18next": "15.7.4",
  "i18next-browser-languagedetector": "8.2.0"
}
```

Note: Translation files are imported statically for better tree-shaking and smaller bundle size.

### **Configuration**
```typescript
// src/i18n/index.ts
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        supportedLngs: ['en', 'pl', 'szl'],
        nonExplicitSupportedLngs: true,
        fallbackLng: {
            szl: ['pl', 'en'],
            default: ['en'],
        },
        debug: process.env.NODE_ENV === 'development',
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
        react: { useSuspense: false },
    });
```

## Translation Structure

### **Translation Files**
```
src/i18n/locales/
├── en.json (English)
├── pl.json (Polish)
└── szl.json (Silesian / Ślōnskŏ)
```

### **Translation Categories**
- **common**: Basic UI elements (buttons, labels, etc.)
- **navigation**: Navigation menu items and loading messages
- **homePage**: Home page specific content
- **hallOfFame**: Hall of Fame page content
- **suggestions**: Suggestions page content
- **github**: GitHub page content
- **donate**: Donation page content
- **user**: User-related content (login, profile, etc.)
- **errors**: Error messages and notifications
- **success**: Success messages
- **validation**: Form validation messages
- **performance**: Performance monitor content
- **footer**: Footer content

## Usage Examples

### **Basic Translation**
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
    const { t } = useTranslation();
    
    return <h1>{t('homePage.title')}</h1>;
}
```

### **Using Custom Hooks**
```typescript
import { useCommonTranslations, useNavigationTranslations } from '../hooks/useTranslations';

function MyComponent() {
    const common = useCommonTranslations();
    const nav = useNavigationTranslations();
    
    return (
        <div>
            <button>{common.save}</button>
            <h1>{nav.home}</h1>
        </div>
    );
}
```

### **Language Switching**
```typescript
import { useTranslations } from '../hooks/useTranslations';

function LanguageSwitcher() {
    const { changeLanguage, currentLanguage } = useTranslations();
    
    return (
        <button onClick={() => changeLanguage('pl')}>
            Switch to Polish
        </button>
    );
}
```

## Components

### **LanguageSwitcher**
- **Location**: `src/components/LanguageSwitcher/`
- **Features**: 
  - Dropdown with flag icons
  - Mobile responsive (shows only flags on small screens)
  - Instant language switching
  - Persistent language storage

### **Custom Hooks**
- **useTranslations()**: General translation hook
- **useCommonTranslations()**: Common UI elements
- **useNavigationTranslations()**: Navigation items
- **useErrorTranslations()**: Error messages
- **useSuccessTranslations()**: Success messages
- **useValidationTranslations()**: Validation messages

## Translation Keys

### **Common Elements**
```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "retry": "Retry",
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

### **Navigation**
```json
{
  "navigation": {
    "home": "Home",
    "hallOfFame": "Hall of Fame",
    "loading": {
      "home": "Loading Home Page...",
      "hallOfFame": "Loading Hall of Fame..."
    }
  }
}
```

### **Error Messages**
```json
{
  "errors": {
    "networkError": "Network error occurred",
    "serverError": "Server error occurred",
    "loadingTimeout": "Loading is taking longer than expected"
  }
}
```

## Performance Impact

### **Bundle Size**
- **Main Bundle**: +37.86 kB (i18n libraries and translations)
- **CSS**: +173 B (language switcher styles)
- **Total Increase**: ~38 kB

### **Optimizations**
- **Code Splitting**: Translations are loaded efficiently
- **Lazy Loading**: Language detection doesn't block initial render
- **Caching**: Language preference cached in localStorage
- **Fallback**: Graceful fallback to English for missing translations

## Language Detection Priority

1. **localStorage**: User's previously selected language
2. **navigator**: Browser's language setting
3. **htmlTag**: HTML lang attribute
4. **fallback**: English (default)

## Adding New Languages

### **1. Create Translation File**
```json
// src/i18n/locales/es.json
{
  "common": {
    "loading": "Cargando...",
    "error": "Error"
  }
}
```

### **2. Update Configuration**
```typescript
// src/i18n/index.ts
import esTranslations from './locales/es.json';

const resources = {
    en: { translation: enTranslations },
    pl: { translation: plTranslations },
    es: { translation: esTranslations }, // Add new language
};
```

### **3. Update Language Switcher**
```typescript
// src/components/LanguageSwitcher/LanguageSwitcher.tsx
const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'szl', name: 'Ślōnskŏ', flag: 'SZL' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }, // Add new language
];
```

## Best Practices

### **Translation Keys**
- Use descriptive, hierarchical keys
- Keep keys consistent across languages
- Use interpolation for dynamic values: `{{variable}}`

### **Content Organization**
- Group related translations together
- Use consistent naming conventions
- Separate UI elements from content

### **Performance**
- Load translations efficiently
- Use fallbacks for missing translations
- Cache language preferences

### **Maintenance**
- Keep translations up to date
- Use translation management tools for larger projects
- Regular review of translation quality

## Development Workflow

### **Adding New Text**
1. Add translation key to English file
2. Add corresponding translation to Polish and Silesian files
3. Use the translation key in components
4. Test all languages

### **Testing Translations**
```bash
# Switch languages in browser
# Test all UI elements
# Verify fallback behavior
# Check mobile responsiveness
```

## Future Enhancements

1. **Translation Management**: Integration with translation services
2. **RTL Support**: Right-to-left language support
3. **Pluralization**: Advanced pluralization rules
4. **Context Support**: Context-aware translations
5. **Auto-translation**: AI-powered translation suggestions
6. **Translation Analytics**: Track translation usage and coverage

## Troubleshooting

### **Common Issues**
- **Missing translations**: Check fallback behavior
- **Language not switching**: Clear localStorage
- **Performance issues**: Check bundle size impact
- **Styling issues**: Verify language switcher CSS

### **Debug Mode**
```typescript
// Enable debug mode in development
debug: process.env.NODE_ENV === 'development'
```

This i18n implementation provides a robust, scalable foundation for multilingual support with excellent user experience and developer-friendly APIs.
