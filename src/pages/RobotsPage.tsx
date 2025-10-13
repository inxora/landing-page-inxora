import { Helmet } from 'react-helmet';
import robotsContent from '../assets/robots.txt?raw';

export default function RobotsPage() {
  return (
    <>
      <Helmet>
        <title>Robots.txt - INXORA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
        {robotsContent}
      </div>
    </>
  );
}
