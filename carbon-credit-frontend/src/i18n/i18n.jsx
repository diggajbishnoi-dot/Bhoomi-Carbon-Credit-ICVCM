import { createContext, useContext, useMemo, useState } from 'react';
import en from './en.json';
import hi from './hi.json';
import pa from './pa.json';
import mr from './mr.json';

const DICTIONARIES = { en, hi, pa, mr };

export const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'mr', label: 'मराठी' },
];

const I18nContext = createContext(null);

// Looks up a dotted key like "home.heroTitle" inside a nested dictionary object.
function lookup(dict, key) {
  return key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), dict);
}

// Replaces {placeholders} in a translated string with values from params.
function interpolate(str, params) {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, name) => (params[name] !== undefined ? params[name] : `{${name}}`));
}

export function I18nProvider({ children }) {
  // No localStorage in the artifact preview — plain state defaulting to English.
  // For a real deployment outside artifacts, swap this for a localStorage-backed default.
  const [language, setLanguage] = useState('en');

  const value = useMemo(() => {
    const dict = DICTIONARIES[language] || DICTIONARIES.en;
    const t = (key, params) => {
      const found = lookup(dict, key) ?? lookup(DICTIONARIES.en, key) ?? key;
      return interpolate(found, params);
    };
    return { language, setLanguage, t };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used inside <I18nProvider>');
  return ctx;
}
