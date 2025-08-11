import { useNavigate } from 'react-router-dom';

const NotFound404 = () => {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12 animate-fade-in">
      <img 
        src="/logo_inxora/LOGO-03.png" 
        alt="Logo INXORA" 
        className="w-48 mb-8 drop-shadow-xl animate-bounce-in filter brightness-110"
        style={{ animationDelay: '0.2s' }}
      />
      <h1 className="text-6xl font-extrabold text-[#D90E8C] mb-4 animate-fade-in drop-shadow-lg" style={{ animationDelay: '0.4s' }}>404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-[#139ED4] mb-2 animate-fade-in drop-shadow-sm" style={{ animationDelay: '0.6s' }}>¡Página no encontrada!</h2>
      <p className="text-gray-300 mb-8 text-center animate-fade-in leading-relaxed" style={{ animationDelay: '0.8s' }}>
        Lo sentimos, la página que buscas no existe o ha sido movida.<br/>
        Puedes volver al inicio para seguir navegando.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-4 bg-gradient-to-r from-[#139ED4] to-[#88D4E4] text-white rounded-xl font-semibold shadow-lg hover:from-[#D90E8C] hover:to-[#771A53] transition-all duration-300 transform hover:scale-105 animate-fade-in"
        style={{ animationDelay: '1s' }}
      >
        Volver al inicio
      </button>
    </section>
  );
};

export default NotFound404; 