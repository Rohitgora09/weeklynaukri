'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    try {
      if (localStorage.getItem('wn_lang') === 'hi') {
        setLangState('hi');
        document.documentElement.lang = 'hi';
      }
    } catch (e) {}
  }, []);

  const setLang = (l) => {
    setLangState(l);
    try {
      localStorage.setItem('wn_lang', l);
    } catch (e) {}
    document.documentElement.lang = l === 'hi' ? 'hi' : 'en';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// Inline bilingual text: <T en="Latest Jobs" hi="नवीनतम नौकरियां" />
// Falls back to English when no Hindi string is provided.
export function T({ en, hi }) {
  const { lang } = useLanguage();
  return lang === 'hi' && hi ? hi : en;
}
