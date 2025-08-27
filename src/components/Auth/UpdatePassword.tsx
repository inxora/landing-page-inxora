import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un token de acceso válido
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      // Establecer la sesión con los tokens
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, [searchParams]);

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      setMessage({
        type: 'error',
        text: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.'
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Las contraseñas no coinciden.'
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setMessage({
        type: 'success',
        text: 'Contraseña actualizada exitosamente. Redirigiendo...'
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Error al actualizar la contraseña'
      });
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = validatePassword(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fcff] via-[#e9f6fc] to-[#daf2f9] dark:from-dark-bg dark:via-dark-surface dark:to-dark-accent pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Actualizar Contraseña
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Ingresa tu nueva contraseña
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nueva contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Indicador de fortaleza */}
              <div className="mt-2 flex items-center gap-2 text-sm">
                {isPasswordValid ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className={isPasswordValid ? 'text-green-600' : 'text-red-600'}>
                  {isPasswordValid ? 'Contraseña válida' : 'Mín. 8 caracteres, mayúscula, minúscula y número'}
                </span>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {confirmPassword.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {passwordsMatch ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={passwordsMatch ? 'text-green-600' : 'text-red-600'}>
                    {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                  </span>
                </div>
              )}
            </div>

            {/* Mensaje de feedback */}
            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading || !isPasswordValid || !passwordsMatch}
              className="w-full py-3 px-4 bg-primary hover:bg-[#0f7ba3] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Actualizando...
                </div>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </form>

          {/* Link para volver */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:text-[#0f7ba3] text-sm font-medium"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
