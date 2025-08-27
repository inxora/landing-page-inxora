import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../hooks/useSupabase';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import { BackButton } from '../common/BackButton';
import { useLanguage } from '../../context/LanguageContext';
import { emailVerificationTranslation } from './emailVerificationTranslation';
import { getRouteByLang } from '../types/routes';

export const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = emailVerificationTranslation[lang];
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // First check if we're already authenticated
        const { data: session } = await supabase.auth.getSession();
        
        if (session?.session?.user?.email_confirmed_at) {
          // User is already verified and logged in
          setVerificationStatus('success');
          setMessage(t.successMessage);
          return;
        }

        // Parse URL parameters from both query string and hash
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Get tokens from either source
        const access_token = urlParams.get('access_token') || hashParams.get('access_token');
        const refresh_token = urlParams.get('refresh_token') || hashParams.get('refresh_token');
        const type = urlParams.get('type') || hashParams.get('type');
        const error_code = urlParams.get('error_code') || hashParams.get('error_code');
        const error_description = urlParams.get('error_description') || hashParams.get('error_description');

        console.log('Current URL:', window.location.href);
        console.log('Search params:', window.location.search);
        console.log('Hash:', window.location.hash);
        console.log('URL params:', { access_token, refresh_token, type, error_code, error_description });

        // Check for errors first
        if (error_code || error_description) {
          setVerificationStatus('error');
          setMessage(error_description || t.errorMessage);
          return;
        }

        // If we have tokens, try to set the session
        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });

          if (error) {
            console.error('Session error:', error);
            setVerificationStatus('error');
            setMessage(t.errorMessage);
          } else if (data.user) {
            setVerificationStatus('success');
            setMessage(t.successMessage);
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setVerificationStatus('error');
            setMessage(t.invalidLinkMessage);
          }
        } else {
          // No tokens found, show helpful information
          console.log('No auth tokens found in URL');
          setVerificationStatus('error');
          setMessage(`${t.invalidLinkMessage} - ${window.location.href}`);
        }
      } catch (error) {
        console.error('General verification error:', error);
        setVerificationStatus('error');
        setMessage(t.generalErrorMessage);
      }
    };

    handleEmailVerification();
  }, [t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fcff] via-[#e9f6fc] to-[#daf2f9] dark:from-dark-bg dark:via-dark-surface dark:to-dark-accent">
      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Botón Atrás */}
          <div className="mb-8">
            <BackButton 
              to={getRouteByLang('home', lang)}
              customText={t.backButton}
              className="mb-8"
            />
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center">
            
            {verificationStatus === 'loading' && (
              <>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t.verifying}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {t.verifyingMessage}
                </p>
              </>
            )}

            {verificationStatus === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
                  {t.verificationSuccess}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {message}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {t.accountActiveMessage}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(getRouteByLang('home', lang))}
                    className="w-full px-6 py-3 bg-primary hover:bg-[#0f7ba3] text-white rounded-lg transition-colors font-medium"
                  >
                    {t.goToHome}
                  </button>
                  <button
                    onClick={() => navigate(getRouteByLang('careers', lang))}
                    className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors font-medium"
                  >
                    {t.viewOpportunities}
                  </button>
                </div>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
                  {t.verificationFailed}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {message}
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    {t.whatToDo}
                  </h3>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• {t.checkEmailSpam}</li>
                    <li>• {t.tryAgainLater}</li>
                    <li>• {t.contactSupportIfPersists}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(getRouteByLang('home', lang))}
                    className="w-full px-6 py-3 bg-primary hover:bg-[#0f7ba3] text-white rounded-lg transition-colors font-medium"
                  >
                    {t.goToHome}
                  </button>
                  <button
                    onClick={() => window.location.href = 'mailto:info@inxora.com'}
                    className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors font-medium"
                  >
                    {t.contactSupport}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
