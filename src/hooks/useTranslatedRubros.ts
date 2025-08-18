import { useState, useEffect } from 'react';
import { translateRubros } from '../utils/translateUtils';
import { useLanguage } from '../context/LanguageContext';

interface Rubro {
  id: number;
  nombre: string;
  nombreOriginal?: string;
}

/**
 * Hook personalizado para manejar la traducción de rubros
 * @param rubrosOriginales - Array de rubros desde la base de datos
 * @returns { rubrosTraducidos, isTranslating, error }
 */
export const useTranslatedRubros = (rubrosOriginales: Rubro[] = []) => {
  const { lang } = useLanguage();
  const [rubrosTraducidos, setRubrosTraducidos] = useState<Rubro[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const traducirRubros = async () => {
      // Si no hay rubros o el idioma es español, usar originales
      if (!rubrosOriginales?.length || lang === 'es') {
        setRubrosTraducidos(rubrosOriginales);
        setIsTranslating(false);
        return;
      }

      setIsTranslating(true);
      setError(null);

      try {
        const traducidos = await translateRubros(rubrosOriginales, lang);
        setRubrosTraducidos(traducidos);
      } catch (err) {
        console.error('Error al traducir rubros:', err);
        setError('Error al traducir los rubros');
        // En caso de error, usar rubros originales
        setRubrosTraducidos(rubrosOriginales);
      } finally {
        setIsTranslating(false);
      }
    };

    traducirRubros();
  }, [rubrosOriginales, lang]);

  return {
    rubrosTraducidos,
    isTranslating,
    error
  };
};
