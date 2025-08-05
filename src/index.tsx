import './index.css';
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from '@/components/ScrollToTop';
import { LanguageProvider } from './context/LanguageContext';

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <LanguageProvider>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </LanguageProvider>
);