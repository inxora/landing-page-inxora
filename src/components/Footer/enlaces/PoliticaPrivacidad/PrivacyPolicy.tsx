import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../../../context/LanguageContext';
import { privacyPolicyTranslations } from './privacyPolicyTranslations';
import { BackButton } from '../../../common/BackButton';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = privacyPolicyTranslations[lang as 'es' | 'en'] || privacyPolicyTranslations['es'];
  return (
    <section className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <BackButton 
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-primary text-white rounded hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow"
        variant="default"
      />
      <Helmet>
        <title>{t.title} | INXORA</title>
        <meta name="description" content={t.title + ' INXORA'} />
        <meta property="og:title" content={t.title + ' | INXORA'} />
        <meta property="og:description" content={t.title + ' INXORA'} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={lang === 'es' ? 'es_PE' : lang === 'en' ? 'en_US' : 'pt_BR'} />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6 text-center">{t.title}</h1>
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-justify" dangerouslySetInnerHTML={{ __html: t.content }} />
    </section>
  );
};

export default PrivacyPolicy; 