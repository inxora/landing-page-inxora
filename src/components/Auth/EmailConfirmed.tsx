import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const EmailConfirmed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fcff] via-[#e9f6fc] to-[#daf2f9] dark:from-dark-bg dark:via-dark-surface dark:to-dark-accent pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center">
          
          {/* Icono de éxito */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>

          {/* Mensaje principal */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¡Felicidades!
          </h1>
          
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Tu correo ha sido autenticado
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Tu dirección de correo electrónico ha sido verificada exitosamente. 
            Ahora puedes acceder a todas las funcionalidades de INXORA.
          </p>

          {/* Características desbloqueadas */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Ahora puedes:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Recibir notificaciones importantes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Acceder a ofertas exclusivas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Participar en oportunidades de inversión
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Conectar con nuestra red de proveedores
              </li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-primary hover:bg-[#0f7ba3] text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Explorar INXORA
            </button>
            
            <button
              onClick={() => navigate('/inversores')}
              className="w-full py-3 px-4 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Ver Oportunidades de Inversión
            </button>
          </div>

          {/* Mensaje adicional */}
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Si tienes alguna pregunta, no dudes en contactarnos. 
              Estamos aquí para ayudarte en tu experiencia con INXORA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmed;
