import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { formatMessage, translations } from "../i18n/translations.js";

const LanguageContext = createContext(null);
const LANG_KEY = "jeevadhwani_lang";

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "ml" ? "ml" : "en";
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === "ml" ? "ml" : "en";
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang(next) {
        setLangState(next === "ml" ? "ml" : "en");
      },
      t(key, values) {
        const table = translations[lang] || translations.en;
        const text = table[key] ?? translations.en[key] ?? key;
        return values ? formatMessage(text, values) : text;
      },
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
