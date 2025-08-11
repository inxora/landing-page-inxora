import { useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { detectLanguageByLocation } from '../utils';
import { GEOIP_COUNTRIES } from '../constants';

export const useLanguageDetection = (showLoader: boolean) => {
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const hasSelectedLang = window.localStorage.getItem("inxora_lang_selected");
    if (hasSelectedLang || showLoader) return;

    detectLanguageByLocation(lang, setLang, GEOIP_COUNTRIES);
  }, [showLoader, lang, setLang]);

  return { lang, setLang };
};
