import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en.json';
import hi from './hi.json';
import pa from './pa.json';
import mr from './mr.json';

const dictionaries = { en, hi, pa, mr };

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'EN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('bhoomi_lang') || 'en';
  });

  const setLanguage = (langCode) => {
    if (dictionaries[langCode]) {
      setLanguageState(langCode);
      localStorage.setItem('bhoomi_lang', langCode);
      document.documentElement.lang = langCode;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  /**
   * Translate key, e.g. t('nav.home') or t('buyer.search_placeholder')
   * Supports nested object keys and parameterized replacement {count}, {name}
   */
  const t = (keyPath, params = {}) => {
    const dict = dictionaries[language] || dictionaries.en;
    const fallbackDict = dictionaries.en;

    const keys = keyPath.split('.');
    let value = dict;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = null;
        break;
      }
    }

    // Fallback to English if missing in current language
    if (!value || typeof value !== 'string') {
      let fbValue = fallbackDict;
      for (const k of keys) {
        if (fbValue && typeof fbValue === 'object' && k in fbValue) {
          fbValue = fbValue[k];
        } else {
          fbValue = null;
          break;
        }
      }
      value = typeof fbValue === 'string' ? fbValue : keyPath;
    }

    // Replace variables e.g. {count}, {price}
    if (typeof value === 'string' && params && typeof params === 'object') {
      Object.entries(params).forEach(([pKey, pVal]) => {
        value = value.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      });
    }

    return value;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
