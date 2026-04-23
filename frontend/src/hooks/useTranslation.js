import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../utils/translations";

export function useTranslation() {
  const { language } = useContext(LanguageContext);
  
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  return { t, language };
}
