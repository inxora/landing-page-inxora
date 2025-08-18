// Función para subir archivos a Google Drive - Implementación OAuth
// Usa OAuth 2.0 en lugar de Service Account para evitar limitaciones de cuota

// Función simple que usa tu Access Token personal
export const uploadToGoogleDrive = async (file: File, folderId: string, clienteId: string): Promise<string> => {
  try {
    // 1. Obtener token de acceso desde variables de entorno
    const accessToken = import.meta.env.VITE_GOOGLE_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('Token de acceso de Google Drive no configurado. Revisa tu archivo .env');
    }
    
    // 2. Crear metadata del archivo con nombre único
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${clienteId}_${file.name}`;
    
    const metadata = {
      name: uniqueFileName,
      parents: [folderId]
    };

    // 3. Preparar FormData para la subida
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    // 4. Subir archivo a Google Drive usando tu cuenta personal
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error al subir archivo a Google Drive: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    
    // 5. Hacer el archivo público para que sea accesible
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${result.id}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      });
    } catch (permissionError) {
      console.warn('No se pudo hacer el archivo público:', permissionError);
      // No es crítico, el archivo sigue subido
    }

    // 6. Retornar URL del archivo
    const fileUrl = `https://drive.google.com/file/d/${result.id}/view`;
    
    console.log(`✅ Archivo ${file.name} subido exitosamente para ${clienteId}`);
    console.log(`📁 URL del archivo: ${fileUrl}`);
    console.log(`🆔 ID del archivo: ${result.id}`);
    
    return fileUrl;
    
  } catch (error) {
    console.error('❌ Error al subir archivo a Google Drive:', error);
    throw error;
  }
};

// Configuración de Google Drive API
export const googleDriveConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || '',
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
  accessToken: import.meta.env.VITE_GOOGLE_ACCESS_TOKEN || ''
};

/* 
PASOS PARA IMPLEMENTACIÓN REAL:

1. Crear proyecto en Google Cloud Console
2. Habilitar Google Drive API
3. Crear credenciales (Service Account o OAuth2)
4. Configurar variables de entorno
5. Instalar google-apis package: npm install googleapis
6. Implementar la función real de subida

Ejemplo de implementación real:

import { google } from 'googleapis';

const drive = google.drive({
  version: 'v3',
  auth: 'YOUR_AUTH_CLIENT'
});

export const uploadToGoogleDriveReal = async (file: File, folderId: string) => {
  const fileMetadata = {
    name: file.name,
    parents: [folderId]
  };

  const media = {
    mimeType: file.type,
    body: file.stream()
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  });

  return `https://drive.google.com/file/d/${response.data.id}/view`;
};
*/
