
import React from 'react';
import { useTranslation } from '../context/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { lang, setLang, t, isRTL } = useTranslation();

  return (
    <div className={`flex flex-col min-h-screen max-w-md mx-auto bg-[#FDFDFF] shadow-2xl relative border-x border-slate-100 overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v8" />
              <path d="M12 10c0 4.418-3.582 8-8 8" />
              <path d="M12 10c0 4.418 3.582 8 8 8" />
              <circle cx="12" cy="10" r="2" fill="white" stroke="none" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">HAYAT</h1>
            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
              {t('family_unit')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button 
            onClick={() => setLang(lang === 'EN' ? 'AR' : 'EN')}
            className="text-[10px] font-black bg-slate-900 text-white border-2 border-slate-900 px-4 py-1.5 rounded-full hover:bg-emerald-600 hover:border-emerald-600 transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
            <span className="text-xs">🌐</span>
            {lang === 'EN' ? 'العربية' : 'ENGLISH'}
            </button>
        </div>
      </header>
      
      <main className="flex-1 pb-32">
        {children}
      </main>
      
      <div className="fixed bottom-0 left-0 w-full p-2 bg-white/80 backdrop-blur-md flex justify-center border-t border-slate-100 items-center gap-2 z-40">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            LOCALIZATION: LINGO.DEV ACTIVE
          </p>
      </div>
    </div>
  );
};
