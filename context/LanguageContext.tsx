
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTranslations } from '../services/lingoService';

type Language = 'EN' | 'AR';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('EN');
  const [translations, setTranslations] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      const data = await fetchTranslations(lang);
      setTranslations(data);
      setIsLoading(false);
    };
    loadTranslations();
  }, [lang]);

  const t = (key: string) => {
    return translations[key] || key;
  };

  const isRTL = lang === 'AR';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL, isLoading }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};
