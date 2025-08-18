// Script para obtener Access Token de Google Drive usando Service Account
// Ejecutar: node scripts/get-access-token.js

import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAccessToken() {
  try {
    // Ruta al archivo JSON del Service Account
    const serviceAccountPath = path.join(__dirname, '..', 'service-account-key.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      console.error('❌ No se encontró el archivo service-account-key.json');
      console.log('📝 Coloca tu archivo JSON del Service Account en la raíz del proyecto con el nombre "service-account-key.json"');
      return;
    }

    const auth = new GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    const authClient = await auth.getClient();
    const accessToken = await authClient.getAccessToken();
    
    console.log('✅ Access Token obtenido exitosamente:');
    console.log('📋 Copia este token a tu archivo .env:');
    console.log('');
    console.log(`VITE_GOOGLE_ACCESS_TOKEN=${accessToken.token}`);
    console.log('');
    console.log('⏰ Nota: Este token tiene duración limitada. Para producción, implementa refresh tokens.');
    
  } catch (error) {
    console.error('❌ Error al obtener Access Token:', error.message);
    console.log('');
    console.log('🔧 Soluciones posibles:');
    console.log('1. Verifica que el archivo service-account-key.json sea válido');
    console.log('2. Asegúrate de que la Google Drive API esté habilitada');
    console.log('3. Confirma que el Service Account tenga los permisos necesarios');
  }
}

getAccessToken();
