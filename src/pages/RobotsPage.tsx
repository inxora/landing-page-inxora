import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';

export default function RobotsPage() {
  const [robotsContent, setRobotsContent] = useState<string>('');

  useEffect(() => {
    fetch('/robots.txt')
      .then(response => response.text())
      .then(content => setRobotsContent(content))
      .catch(error => console.error('Error loading robots:', error));
  }, []);

  return (
    <>
      <Helmet>
        <title>Robots.txt - INXORA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
        {robotsContent || 'Loading robots.txt...'}
      </div>
    </>
  );
}