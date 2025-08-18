// Configuración centralizada de Google Drive para INXORA
// Este archivo contiene los IDs de las carpetas específicas para cada tipo de usuario

export const googleDriveConfig = {
  // IDs de carpetas de Google Drive por tipo de usuario
  folderIds: {
    // Carpeta específica para archivos de proveedores
    // Incluye: catálogos, certificaciones, documentación técnica
    proveedores: '1j0K9Sm7L3ElJN6Km9HQ_-3k0MlVLZFZa',
    
    // Carpeta para archivos de clientes (carpeta por defecto en BD)
    // Incluye: cotizaciones, documentos empresariales
    clientes: '1OA2eNSHKP0p6iQHvwAEpbJ9GUyJJoWEf',
    
    // Carpeta para inversionistas (por definir si se requiere)
    inversionistas: null // TBD - Por ahora no manejan archivos
  },
  
  // Configuración para producción (cuando se implemente Google Drive API real)
  // production: {
  //   // apiKey: process.env.VITE_GOOGLE_DRIVE_API_KEY || '',
  //   clientId: process.env.VITE_GOOGLE_CLIENT_ID || '',
  //   clientSecret: process.env.VITE_GOOGLE_CLIENT_SECRET || ''
  // },
  
  // Límites y validaciones
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFilesPerUpload: 5,
    allowedTypes: {
      'application/pdf': '.pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.ms-excel': '.xls',
      'text/csv': '.csv',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'image/jpeg': '.jpg,.jpeg',
      'image/png': '.png'
    }
  }
};

// Función helper para obtener el folder ID según el tipo de usuario
export const getFolderIdByUserType = (userType: 'proveedores' | 'clientes' | 'inversionistas'): string => {
  const folderId = googleDriveConfig.folderIds[userType];
  
  if (!folderId) {
    throw new Error(`No hay carpeta configurada para el tipo de usuario: ${userType}`);
  }
  
  return folderId;
};

// Función helper para validar archivo
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const { maxFileSize, allowedTypes } = googleDriveConfig.limits;
  
  // Validar tipo
  if (!allowedTypes[file.type as keyof typeof allowedTypes]) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido: ${file.name}. Solo se permiten: PDF, Excel, Word e imágenes.`
    };
  }
  
  // Validar tamaño
  if (file.size > maxFileSize) {
    return {
      isValid: false,
      error: `El archivo ${file.name} excede el tamaño máximo de ${maxFileSize / 1024 / 1024}MB`
    };
  }
  
  // Validar nombre
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s_\-.()'´]+$/.test(file.name)) {
    return {
      isValid: false,
      error: `El nombre del archivo ${file.name} contiene caracteres no permitidos.`
    };
  }
  
  return { isValid: true };
};

export default googleDriveConfig;
