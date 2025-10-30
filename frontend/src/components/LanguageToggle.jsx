import React from "react";
import { useLanguage } from "../i18n/LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 border border-slate-200/60 shadow-sm">
      <button
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
        className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer group ${
          lang === "en" 
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25" 
            : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
        }`}
      >
        <span className="relative z-10 flex items-center space-x-2">
          <span className="text-xs">🇺🇸</span>
          <span>{t("languageEnglish")}</span>
        </span>
        
        {/* Hover effect */}
        {lang !== "en" && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
        
        {/* Active state shimmer */}
        {lang === "en" && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        )}
      </button>
      
      <button
        aria-pressed={lang === "hi"}
        onClick={() => setLang("hi")}
        className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer group ${
          lang === "hi" 
            ? "bg-blue-600 text-white shadow-lg shadow-amber-500/25" 
            : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
        }`}
      >
        <span className="relative z-10 flex items-center space-x-2">
          <span className="text-xs">🇮🇳</span>
          <span>{t("languageHindi")}</span>
        </span>
        
        {/* Hover effect */}
        {lang !== "hi" && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
        
        {/* Active state shimmer */}
        {lang === "hi" && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        )}
      </button>
    </div>
  );
}