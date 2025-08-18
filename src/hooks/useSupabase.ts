import { createClient } from '@supabase/supabase-js';
import { uploadToGoogleDrive } from '../utils/googleDriveUpload';
import { getFolderIdByUserType } from '../config/googleDriveConfig';
import { APP_CONFIG } from '../config/appConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Función para generar contraseña temporal segura
const generateTemporaryPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Hook para obtener datos de referencia
export const useSupabaseData = () => {
  
  // Obtener países
  const getPaises = async () => {
    try {
      const { data, error } = await supabase
        .from('pais')
        .select(`
          id, 
          nombre, 
          iso_code, 
          iso_code_2, 
          prefijo_telefonico,
          nombre_doc_personal,
          nombre_doc_empresa,
          patron_telefono,
          patron_doc_personal,
          patron_doc_empresa,
          id_moneda_principal,
          moneda:id_moneda_principal(id, codigo, nombre, simbolo)
        `)
        .eq('activo', true)
        .order('nombre');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener países:', error);
      return [];
    }
  };

  // Obtener rubros
  const getRubros = async () => {
    try {
      const { data, error } = await supabase
        .from('rubro')
        .select('id, nombre, descripcion')
        .eq('activo', true)
        .order('nombre');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener rubros:', error);
      return [];
    }
  };

  // Obtener tipos de cliente
  const getTiposCliente = async () => {
    try {
      const { data, error } = await supabase
        .from('tipo_cliente')
        .select('id, nombre, descripcion')
        .order('id');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener tipos de cliente:', error);
      return [];
    }
  };

  // Obtener tipos de vehículos
  const getTiposVehiculos = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('id, name, description')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener tipos de vehículos:', error);
      return [];
    }
  };

  // Obtener distritos de Lima
  const getDistritos = async () => {
    try {
      const { data, error } = await supabase
        .from('distrito')
        .select('id, nombre, descripcion')
        .eq('activo', true)
        .order('nombre');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener distritos:', error);
      return [];
    }
  };

  // Obtener marcas
  const getMarcas = async () => {
    try {
      const { data, error } = await supabase
        .from('marca')
        .select('id, nombre, descripcion')
        .eq('activo', true)
        .order('nombre');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      return [];
    }
  };

  // Obtener monedas
  const getMonedas = async () => {
    try {
      const { data, error } = await supabase
        .from('moneda')
        .select('id, codigo, nombre, simbolo')
        .eq('activo', true)
        .order('codigo');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener monedas:', error);
      return [];
    }
  };

  // Insertar cliente
  const insertCliente = async (clienteData: any) => {
    try {
      const { data, error } = await supabase
        .from('cliente')
        .insert([clienteData])
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error al insertar cliente:', error);
      return { success: false, error };
    }
  };

  // Insertar condiciones comerciales para proveedor
  const insertCondicionesComerciales = async (condiciones: any) => {
    try {
      const { data, error } = await supabase
        .from('condiciones_comerciales')
        .insert([condiciones])
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error al insertar condiciones comerciales:', error);
      return { success: false, error };
    }
  };

  // Insertar proveedor
  const insertProveedor = async (proveedorData: any) => {
    try {
      const { data, error } = await supabase
        .from('proveedor')
        .insert([proveedorData])
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error al insertar proveedor:', error);
      return { success: false, error };
    }
  };

  // Insertar relación proveedor-marca
  const insertProveedorMarca = async (relaciones: any[]) => {
    try {
      const { data, error } = await supabase
        .from('proveedor_marca')
        .insert(relaciones)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error al insertar relaciones proveedor-marca:', error);
      return { success: false, error };
    }
  };

  // Insertar archivo en la tabla archivo_adjunto
  const insertArchivoAdjunto = async (archivoData: {
    nombre_original: string;
    nombre_almacenado: string;
    extension: string;
    tamano_mb: number;
    url_descarga: string;
    google_drive_folder_id?: string;
    google_drive_file_id?: string;
    url_thumbnail?: string;
    estado?: string;
    tipo_detectado?: string;
    contenido_extraido?: string;
    es_seguro?: boolean;
    scan_malware?: string;
    subido_por?: number;
    fecha_subida?: string;
    ip_origen?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('archivo_adjunto')
        .insert([{
          ...archivoData,
          google_drive_folder_id: archivoData.google_drive_folder_id || '1OA2eNSHKP0p6iQHvwAEpbJ9GUyJJoWEf',
          fecha_subida: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error al insertar archivo adjunto:', error);
      return { success: false, error };
    }
  };

  // Crear relación entre solicitud y archivo
  const insertSolicitudArchivo = async (relacionData: {
    id_solicitud_cotizacion: number;
    id_archivo: number;
    tipo_documento?: string;
    es_principal?: boolean;
    orden?: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('solicitud_archivo')
        .insert([relacionData])
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error al insertar relación solicitud-archivo:', error);
      return { success: false, error };
    }
  };

  // Crear solicitud de cotización simplificada
  const insertSolicitudCotizacion = async (solicitudData: {
    cliente_id?: number;
    proveedor_id?: number;
    estado?: string;
    descripcion?: string;
  }) => {
    try {
      // Estructura básica que debería funcionar con la mayoría de esquemas
      const solicitudBase: any = {
        estado: solicitudData.estado || 'PENDIENTE',
        descripcion: solicitudData.descripcion || 'Solicitud automática generada al subir archivos',
        fecha_solicitud: new Date().toISOString()
      };

      // Agregar ID de cliente si se proporciona
      if (solicitudData.cliente_id) {
        solicitudBase.cliente_id = solicitudData.cliente_id;
      }

      // Agregar ID de proveedor si se proporciona  
      if (solicitudData.proveedor_id) {
        solicitudBase.proveedor_id = solicitudData.proveedor_id;
      }

      const { data, error } = await supabase
        .from('solicitud_cotizacion')
        .insert([solicitudBase])
        .select();

      if (error) {
        console.error('Error al insertar solicitud:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error al insertar solicitud:', error);
      return { success: false, error };
    }
  };

  // Subir archivos de cliente con Drive real (documentos para solicitar cotización)
  const uploadClienteFiles = async (files: File[], clienteId: number): Promise<{ success: boolean; archivos?: any[]; error?: any }> => {
    try {
      const folderId = getFolderIdByUserType('clientes');
      const archivosSubidos: any[] = [];

      for (const file of files) {
        try {
          // 1. Subir archivo a Google Drive (implementación real)
          const googleDriveUrl = await uploadToGoogleDrive(file, folderId, `cliente_${clienteId}`);
          
          // 2. Extraer el ID del archivo de la URL de Google Drive
          const fileIdMatch = googleDriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
          const googleDriveFileId = fileIdMatch ? fileIdMatch[1] : null;
          
          // 3. Guardar metadata en archivo_adjunto
          const extension = file.name.split('.').pop() || '';
          const timestamp = Date.now();
          const nombreUnico = `${timestamp}_cliente_${clienteId}_${file.name}`;
          
          const archivoResult = await insertArchivoAdjunto({
            nombre_original: file.name,
            nombre_almacenado: nombreUnico,
            extension,
            tamano_mb: Number((file.size / (1024 * 1024)).toFixed(2)),
            url_descarga: googleDriveUrl,
            google_drive_folder_id: folderId,
            google_drive_file_id: googleDriveFileId || `MANUAL_${timestamp}`
          });

          if (archivoResult.success && archivoResult.data?.[0]) {
            // 4. Archivo subido exitosamente (sin relaciones por ahora)
            archivosSubidos.push({
              archivo: archivoResult.data[0],
              url: archivoResult.data[0].url_descarga,
              tipo: 'DOCUMENTACION_CLIENTE'
            });
            console.log('✅ Archivo de cliente subido exitosamente:', archivoResult.data[0]);
          }
        } catch (fileError) {
          console.error(`Error al procesar archivo ${file.name}:`, fileError);
        }
      }

      return { success: true, archivos: archivosSubidos };
    } catch (error) {
      console.error('Error al subir archivos de cliente:', error);
      return { success: false, error };
    }
  };

  // Subir archivos de proveedor con Drive real (listas/catálogos de productos)
  const uploadProveedorFiles = async (files: File[], proveedorId: number): Promise<{ success: boolean; archivos?: any[]; error?: any }> => {
    try {
      const folderId = getFolderIdByUserType('proveedores');
      const archivosSubidos: any[] = [];

      for (const file of files) {
        try {
          // 1. Subir archivo a Google Drive (implementación real)
          const googleDriveUrl = await uploadToGoogleDrive(file, folderId, `proveedor_${proveedorId}`);
          
          // 2. Extraer el ID del archivo de la URL de Google Drive
          const fileIdMatch = googleDriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
          const googleDriveFileId = fileIdMatch ? fileIdMatch[1] : null;
          
          // 3. Guardar metadata en archivo_adjunto
          const extension = file.name.split('.').pop() || '';
          const timestamp = Date.now();
          const nombreUnico = `${timestamp}_proveedor_${proveedorId}_${file.name}`;
          
          const archivoResult = await insertArchivoAdjunto({
            nombre_original: file.name,
            nombre_almacenado: nombreUnico,
            extension,
            tamano_mb: Number((file.size / (1024 * 1024)).toFixed(2)),
            url_descarga: googleDriveUrl,
            google_drive_folder_id: folderId,
            google_drive_file_id: googleDriveFileId || `MANUAL_${timestamp}`
          });

          if (archivoResult.success && archivoResult.data?.[0]) {
            // 4. Archivo de lista/catálogo subido exitosamente
            archivosSubidos.push({
              archivo: archivoResult.data[0],
              url: archivoResult.data[0].url_descarga,
              tipo: 'LISTA_PRODUCTOS'
            });
            console.log('✅ Lista/catálogo de proveedor subido exitosamente:', archivoResult.data[0]);
          }
        } catch (fileError) {
          console.error(`Error al procesar archivo ${file.name}:`, fileError);
        }
      }

      return { success: true, archivos: archivosSubidos };
    } catch (error) {
      console.error('Error al subir archivos de proveedor:', error);
      return { success: false, error };
    }
  };

  // Registrar inversionista
  const registrarInversionista = async (datos: {
    nombre: string;
    apellidos: string;
    correo: string;
    telefono_directo: string;
    contrasena: string;
  }) => {
    try {
      // 1. Verificar si el email ya existe
      const { data: usuarioExistente, error: errorConsulta } = await supabase
        .from('usuario')
        .select('correo')
        .eq('correo', datos.correo)
        .maybeSingle(); // Usar maybeSingle() en lugar de single()

      if (errorConsulta) {
        throw new Error('Error al verificar el correo electrónico');
      }

      if (usuarioExistente) {
        throw new Error('Ya existe un usuario registrado con este correo electrónico');
      }

      // 2. Crear usuario con la contraseña proporcionada
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: datos.correo,
        password: datos.contrasena,
        options: {
          emailRedirectTo: APP_CONFIG.EMAIL_VERIFICATION_URL,
          data: {
            nombre: datos.nombre,
            apellidos: datos.apellidos,
            telefono_directo: datos.telefono_directo,
            tipo_usuario: 'INVERSIONISTA'
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('Este correo ya está registrado en el sistema');
        }
        throw authError;
      }

      if (!authData.user) throw new Error('No se pudo crear el usuario de autenticación');

      // 3. Crear registro en la tabla usuario
      const { data: usuario, error: errorUsuario } = await supabase
        .from('usuario')
        .insert({
          nombre: datos.nombre,
          apellidos: datos.apellidos,
          correo: datos.correo,
          telefono_directo: datos.telefono_directo || null,
          auth_user_id: authData.user.id,
          activo: true
        })
        .select();

      if (errorUsuario) {
        throw errorUsuario;
      }

      // Verificar que se creó el usuario
      if (!usuario || usuario.length === 0) {
        throw new Error('Error al crear el registro del usuario');
      }

      return { 
        success: true, 
        data: { 
          usuario: usuario[0], // Tomar el primer elemento del array
          auth_user_id: authData.user.id,
          mensaje: 'Inversionista registrado exitosamente. Se ha enviado un email de verificación.'
        }
      };
    } catch (error) {
      console.error('Error al registrar inversionista:', error);
      return { success: false, error };
    }
  };

  // Registrar recogedor
  const registrarRecogedor = async (data: {
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    contrasena: string;
    distrito_id: string;
    vehiculo: string;
    experiencia?: string;
  }) => {
    try {
      // 1. Verificar que el vehículo existe en la tabla vehicle_types
      const { data: vehiculoData, error: vehiculoError } = await supabase
        .from('vehicle_types')
        .select('id')
        .eq('name', data.vehiculo)
        .single();

      if (vehiculoError || !vehiculoData) {
        console.error('Error al obtener tipo de vehículo:', vehiculoError);
        return { 
          success: false, 
          error: 'Tipo de vehículo no válido. Por favor selecciona una opción válida.' 
        };
      }

      // 2. Verificar que el correo no esté duplicado
      const { data: existingRecogedor, error: checkError } = await supabase
        .from('recogedores')
        .select('correo')
        .eq('correo', data.correo)
        .maybeSingle();

      if (checkError) {
        console.error('Error al verificar email existente:', checkError);
        return { 
          success: false, 
          error: 'Error al verificar los datos. Intenta nuevamente.' 
        };
      }

      if (existingRecogedor) {
        return { 
          success: false, 
          error: 'Este correo ya está registrado.' 
        };
      }

      // 3. Insertar directamente en la tabla recogedores (sin Auth)
      const { error: insertError } = await supabase
        .from('recogedores')
        .insert({
          nombre: data.nombre,
          apellidos: data.apellidos,
          correo: data.correo,
          telefono: data.telefono,
          contrasena: data.contrasena, // Se guarda tal como viene
          distrito_preferido_id: parseInt(data.distrito_id), // Convertir a número
          vehiculo_id: vehiculoData.id,
          experiencia: data.experiencia || null,
          auth_user_id: null, // No hay usuario de Auth asociado
          status: 'activo' // Activo inmediatamente
        });

      if (insertError) {
        console.error('Error al crear el perfil:', insertError);
        return { 
          success: false, 
          error: 'Error al completar el registro. Intenta nuevamente.' 
        };
      }

      return { 
        success: true, 
        message: '¡Registro exitoso! Tu información ha sido guardada y te contactaremos pronto.',
        needsVerification: false
      };

    } catch (error) {
      console.error('Error en registrarRecogedor:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  return {
    getPaises,
    getRubros,
    getTiposCliente,
    getTiposVehiculos,
    getDistritos,
    getMarcas,
    getMonedas,
    insertCliente,
    insertCondicionesComerciales,
    insertProveedor,
    insertProveedorMarca,
    insertArchivoAdjunto,
    insertSolicitudCotizacion,
    insertSolicitudArchivo,
    uploadClienteFiles,
    uploadProveedorFiles,
    registrarInversionista,
    registrarRecogedor
  };
};
