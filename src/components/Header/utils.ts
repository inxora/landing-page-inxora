// Utility functions for Header
export const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const detectLanguageByLocation = async (
  currentLang: string,
  setLang: (lang: string) => void,
  geoipCountries: typeof import('./constants').GEOIP_COUNTRIES
) => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    if (!data?.country_code) return;

    if (geoipCountries.PORTUGUESE.includes(data.country_code) && currentLang !== "pt") {
      setLang("pt");
    } else if (geoipCountries.ENGLISH.includes(data.country_code) && currentLang !== "en") {
      setLang("en");
    }
  } catch (error) {
    console.warn('Error detecting location for language:', error);
  }
};
