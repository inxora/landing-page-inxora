import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { productsSectionTranslation } from './productsSectionTranslation';
import { buildCategoryUrl, buildCatalogUrl } from '../../utils/product-url';
import { getCategorias, type CategoriaApi } from '../../lib/api/categorias';

export const ProductsSection = () => {
  const { lang } = useLanguage();
  const t = productsSectionTranslation[lang];
  const locale = lang === 'es' ? 'es' : lang === 'en' ? 'en' : 'pt';

  const [categories, setCategories] = useState<CategoriaApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const categorias = await getCategorias();
        setCategories(categorias);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar categorías');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const newPosition = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  const handleImageError = (categoryId: number) => {
    setImageErrors(prev => ({ ...prev, [categoryId]: true }));
  };

  if (loading) {
    return (
      <section id="productos" className="py-8 md:py-12 lg:py-16 bg-gray-50 w-full scroll-mt-20 md:scroll-mt-32">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              <span className="text-primary-dark">{t.titleMain} </span>
              <span className="text-accent-bright">{t.titleAccent}</span>
            </h2>
          </div>
          <div className="flex justify-center py-16">
            <div className="animate-pulse flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-40 h-40 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories || categories.length === 0) {
    return (
      <section id="productos" className="py-8 md:py-12 lg:py-16 bg-gray-50 w-full scroll-mt-20 md:scroll-mt-32">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600 font-montserrat">{error ?? 'No hay categorías disponibles'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="productos" className="py-8 md:py-12 lg:py-16 bg-gray-50 w-full scroll-mt-20 md:scroll-mt-32">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 line-clamp-2">
            <span className="font-orbitron text-primary-dark">{t.titleMain} </span>
            <span className="font-orbitron text-accent-bright">{t.titleAccent}</span>
          </h2>
          <p className="font-montserrat text-lg text-foreground-secondary max-w-3xl mx-auto line-clamp-2 md:line-clamp-none">
            {t.subtitle}
          </p>
        </div>

        <div className="relative w-full">
          {/* Botones de navegación */}
          {categories.length > 4 && (
            <>
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 ${
                  !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-primary-dark" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 ${
                  !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary-dark" />
              </button>
            </>
          )}

          {/* Gradientes laterales */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent z-[5] pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent z-[5] pointer-events-none" />
          )}

          {/* Contenedor del carousel */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-4"
            onScroll={checkScrollability}
          >
            {categories.map((category) => {
              const categoryUrl = buildCategoryUrl(category.nombre, locale);
              const hasError = imageErrors[category.id];

              return (
                <a
                  key={category.id}
                  href={categoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-shrink-0 flex flex-col transition-transform duration-300 hover:scale-105"
                  style={{ width: 'clamp(140px, 18vw, 200px)' }}
                >
                  <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-t-4 border-accent hover:border-accent-bright flex flex-col h-full">
                    <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center">
                      {category.logo_url && !hasError ? (
                        <img
                          src={category.logo_url}
                          alt={`Categoría ${category.nombre} - Suministros industriales`}
                          title={`Categoría ${category.nombre} - Suministros industriales`}
                          className="w-full h-full object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          onError={() => handleImageError(category.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <span className="text-2xl sm:text-3xl font-bold text-primary">
                            {category.nombre.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-orbitron text-sm md:text-base font-bold text-center text-primary-dark break-words leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                        {category.nombre}
                      </h3>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 mt-auto">
                      <span className="font-orbitron text-accent hover:text-accent-bright font-medium flex items-center justify-center transition-all duration-200 text-xs md:text-base">
                        {t.verProductos} <ChevronRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href={buildCatalogUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {t.verCatalogo} <ChevronRight size={20} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};
