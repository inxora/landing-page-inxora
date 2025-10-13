import { Helmet } from 'react-helmet';
import sitemapContent from '../assets/sitemap.xml?raw';

export default function SitemapPage() {
  return (
    <>
      <Helmet>
        <title>Sitemap - INXORA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
        {sitemapContent}
      </div>
    </>
  );
}
