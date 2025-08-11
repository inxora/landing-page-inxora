import { useEffect, useState } from 'react';

export const useLoader = () => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const hasVisited = window.sessionStorage.getItem("inxora_visited");
    if (!hasVisited) {
      setShowLoader(true);
      window.sessionStorage.setItem("inxora_visited", "true");
      const timer = setTimeout(() => setShowLoader(false), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return showLoader;
};
