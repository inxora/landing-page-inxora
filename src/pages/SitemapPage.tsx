import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';

export default function SitemapPage() {
  const [sitemapContent, setSitemapContent] = useState<string>('');

  useEffect(() => {
    fetch('/sitemap.xml')
      .then(response => response.text())
      .then(content => setSitemapContent(content))
      .catch(error => console.error('Error loading sitemap:', error));
  }, []);

  return (
    <>
      <Helmet>
        <title>Sitemap - INXORA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
        {sitemapContent || 'Loading sitemap...'}
      </div>
    </>
  );
}