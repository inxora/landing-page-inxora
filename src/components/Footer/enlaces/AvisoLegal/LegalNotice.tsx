import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../../../context/LanguageContext';
import { legalNoticeTranslations } from './legalNoticeTranslations';

const LegalNotice = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = legalNoticeTranslations[lang];
  return (
    <section className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-[#139ED4] text-white rounded hover:bg-[#171D4C] transition-colors font-medium shadow"
        aria-label={t.title}
      >
        ← {lang === 'es' ? 'Atrás' : lang === 'en' ? 'Back' : 'Voltar'}
      </button>
      <Helmet>
        <title>{t.title} | INXORA</title>
        <meta name="description" content={t.title + ' INXORA'} />
        <meta property="og:title" content={t.title + ' | INXORA'} />
        <meta property="og:description" content={t.title + ' INXORA'} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={lang === 'es' ? 'es_PE' : lang === 'en' ? 'en_US' : 'pt_BR'} />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold text-[#171D4C] mb-6 text-center">{t.title}</h1>
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-justify" dangerouslySetInnerHTML={{ __html: t.content }} />

    </section>
  );
};

export default LegalNotice; 