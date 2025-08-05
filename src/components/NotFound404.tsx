import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound404 = () => {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#e9f6fc] px-4 py-12 animate-fade-in">
      <img 
        src="/logo_inxora/LOGO-03.png" 
        alt="Logo INXORA" 
        className="w-48 mb-8 drop-shadow-lg animate-bounce-in"
        style={{ animationDelay: '0.2s' }}
      />
      <h1 className="text-6xl font-extrabold text-[#D90E8C] mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-[#139ED4] mb-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>¡Página no encontrada!</h2>
      <p className="text-gray-600 mb-8 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
        Lo sentimos, la página que buscas no existe o ha sido movida.<br/>
        Puedes volver al inicio para seguir navegando.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-[#139ED4] text-white rounded-lg font-semibold shadow hover:bg-[#D90E8C] transition-colors animate-fade-in"
        style={{ animationDelay: '1s' }}
      >
        Volver al inicio
      </button>
    </section>
  );
};

export default NotFound404;

// Animaciones Tailwind personalizadas sugeridas (agregar en tailwind.config.js):
// animate-fade-in: { 'from': { opacity: 0 }, 'to': { opacity: 1 } }
// animate-bounce-in: { '0%': { transform: 'scale(0.8)' }, '60%': { transform: 'scale(1.1)' }, '100%': { transform: 'scale(1)' } } 