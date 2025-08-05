import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { footerTranslations } from './footerTranslations';
import { getRouteByLang } from '../types/routes';

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = footerTranslations[lang];
  return <footer className="bg-gray-800 text-white w-full">
    <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          <div>
          <span
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate("/");
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <img src="/logo_inxora/LOGO-35.png" alt="INXORA - Marketplace de suministros industriales" className="h-20 w-auto mb-6 brightness-200" />
          </span>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61577615567230" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/inxora.global/" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/inxoraglobal/about/" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div>
          <h3 className="font-semibold text-lg mb-4 text-[#139ED4]">{t.productos}</h3>
            <ul className="space-y-2">
              <li>
              <a href="/Folleto INXORA.pdf" target="_blank" rel="noopener noreferrer" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.iluminacion}
              </a>
            </li>
            <li>
              <a href="/Folleto INXORA.pdf" target="_blank" rel="noopener noreferrer" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.componentes}
              </a>
            </li>
            <li>
              <a href="/Folleto INXORA.pdf" target="_blank" rel="noopener noreferrer" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.instrumentacion}
              </a>
            </li>
            <li>
              <a href="/Folleto INXORA.pdf" target="_blank" rel="noopener noreferrer" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.neumatica}
                </a>
              </li>
              <li>
              <a href="/Folleto INXORA.pdf" target="_blank" rel="noopener noreferrer" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.herramientas}
                </a>
              </li>
              <li>
              <a href="/Folleto INXORA.pdf" target="_blank" rel="noopener noreferrer" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.mecanica}
                </a>
              </li>
              <li>
              <a href="/Folleto INXORA.pdf" target="_blank" rel="noopener noreferrer" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.valvulas}
                </a>
              </li>
              <li>
              <a href="/Folleto INXORA.pdf" target="_blank" rel="noopener noreferrer" className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.limpieza}
                </a>
              </li>
            </ul>
          </div>
          <div>
          <h3 className="font-semibold text-lg mb-4 text-[#139ED4]">{t.enlaces}</h3>
            <ul className="space-y-2">
            <li>
              <Link to={getRouteByLang('legal', lang)} className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.avisoLegal}
              </Link>
              </li>
              <li>
              <Link to={getRouteByLang('privacy', lang)} className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.privacidad}
              </Link>
              </li>
              <li>
              <Link to={getRouteByLang('cookies', lang)} className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.cookies}
              </Link>
              </li>
              <li>
              <Link to={getRouteByLang('terms', lang)} className="text-[#88D4E4] hover:text-[#D90E8C] transition-colors">
                {t.terminos}
              </Link>
              </li>
            </ul>
          </div>
          <div>
          <h3 className="font-semibold text-lg mb-4 text-[#139ED4]">{t.contacto}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 text-[#88D4E4]" />
              <span className="text-[#88D4E4]">{t.direccion}</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-[#88D4E4]" />
                <span className="text-[#88D4E4]">+51 946 885 531</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-[#88D4E4]" />
                <span className="text-[#88D4E4]">contacto@inxora.com</span>
              </li>
            </ul>
          <div className="flex flex-col items-center mt-4">
            <Link to="/libro-de-reclamaciones" className="group flex flex-col items-center">
              <img
                src="/libro_reclamaciones.png"
                alt={t.libro}
                className="w-[100px] h-auto opacity-90 transition-transform duration-200 hover:scale-110 drop-shadow"
                onClick={() => navigate(getRouteByLang('claims', lang))}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[#139ED4] mt-4 pt-4 text-center text-[#88D4E4] text-xs sm:text-sm">
          <p>
          © {new Date().getFullYear()} INXORA. {t.derechos} | {t.marketplace}
          </p>
        </div>
      </div>
    </footer>;
};