import translate from 'google-translate-api-x';

// Cache para evitar traducciones repetidas
const translationCache = new Map<string, string>();

// Mapeo de códigos de idioma
const langMap: Record<string, string> = {
  es: 'es',
  en: 'en', 
  pt: 'pt'
};

/**
 * Traduce un texto usando Google Translate API
 * @param text - Texto a traducir
 * @param targetLang - Idioma objetivo ('es', 'en', 'pt')
 * @param sourceLang - Idioma origen (por defecto 'es')
 * @returns Promise<string> - Texto traducido
 */
export const translateText = async (
  text: string, 
  targetLang: string, 
  sourceLang: string = 'es'
): Promise<string> => {
  // Si el idioma objetivo es el mismo que el origen, no traducir
  if (targetLang === sourceLang) {
    return text;
  }

  // Crear clave de cache
  const cacheKey = `${sourceLang}-${targetLang}-${text}`;
  
  // Verificar cache
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    // Traducir usando Google Translate
    const result = await translate(text, { 
      from: sourceLang, 
      to: langMap[targetLang] || targetLang 
    });
    
    const translatedText = result.text;
    
    // Guardar en cache
    translationCache.set(cacheKey, translatedText);
    
    return translatedText;
  } catch (error) {
    console.error('Error al traducir:', error);
    // En caso de error, devolver el texto original
    return text;
  }
};

/**
 * Traduce múltiples textos de forma optimizada
 * @param texts - Array de textos a traducir
 * @param targetLang - Idioma objetivo
 * @param sourceLang - Idioma origen
 * @returns Promise<string[]> - Array de textos traducidos
 */
export const translateTexts = async (
  texts: string[], 
  targetLang: string, 
  sourceLang: string = 'es'
): Promise<string[]> => {
  const promises = texts.map(text => translateText(text, targetLang, sourceLang));
  return Promise.all(promises);
};

/**
 * Hook personalizado para traducir rubros
 * @param rubros - Array de objetos rubro con nombre
 * @param targetLang - Idioma objetivo
 * @returns Promise con rubros traducidos
 */
export const translateRubros = async (
  rubros: Array<{ id: number; nombre: string }>, 
  targetLang: string
): Promise<Array<{ id: number; nombre: string; nombreOriginal: string }>> => {
  if (!rubros?.length) return [];

  const nombres = rubros.map(r => r.nombre);
  const nombresTraducidos = await translateTexts(nombres, targetLang);

  return rubros.map((rubro, index) => ({
    ...rubro,
    nombre: nombresTraducidos[index] || rubro.nombre,
    nombreOriginal: rubro.nombre
  }));
};
