function doPost(e) {
  try {
    const folderId = '1j0K9Sm7L3ElJN6Km9HQ_-3k0MlVLZFZa'; // Carpeta de Drive
    const sheetId = '1__ZmWv11A48IWQ-zRBUYZ0iCq3GvSEJusNLiwVZHJoQ'; // Google Sheet
    const folder = DriveApp.getFolderById(folderId);
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();

    // Obtener y limpiar datos del formulario
    const jsonData = JSON.parse(e.postData.contents);
    const formData = jsonData;
    const files = formData.files || [];
    delete formData.files;

    // Validaciones - Mismos tipos que el script de clientes
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    const maxFileSize = 10 * 1024 * 1024; // 10 MB

    let filesLinks = [];

    files.forEach((fileData) => {
      try {
        const base64 = fileData.content.split(',')[1];
        const blob = Utilities.newBlob(
          Utilities.base64Decode(base64),
          fileData.type,
          fileData.name
        );

        // Validar tipo de archivo
        if (!allowedMimeTypes.includes(blob.getContentType())) {
          throw new Error(`Tipo de archivo no permitido: ${blob.getContentType()}`);
        }

        // Validar tamaño
        if (blob.getBytes().length > maxFileSize) {
          throw new Error(`Archivo demasiado grande: ${blob.getName()}`);
        }

        // Subir archivo
        const uploaded = folder.createFile(blob);
        uploaded.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        const hyperlink = `=HYPERLINK("${uploaded.getUrl()}"; "${uploaded.getName()}")`;
        filesLinks.push(hyperlink);

        Logger.log('Archivo subido: ' + uploaded.getName());

      } catch (fileError) {
        Logger.log('Archivo inválido: ' + fileError.toString());
        filesLinks.push('ERROR: ' + fileData.name);
      }
    });

    // Registrar datos en hoja
    sheet.appendRow([
      new Date(),
      formData['Dirección de correo electrónico'] || '',
      formData['Razón Social:'] || '',
      formData['RUC:'] || '',
      formData['Dirección:'] || '',
      formData['Nombre del Contacto:'] || '',
      formData['Correo:'] || '',
      formData['Teléfono:'] || '',
      formData['Marcas que representa:'] || '',
      formData['Cuenta con soporte técnico para asesoramiento de productos:'] || '',
      filesLinks.join('\n'),
      formData['Ofrece crédito:'] || '',
      formData['Condiciones de crédito:'] || '',
      formData['Cantidad mínima por pedido o monto mínimo:'] || '',
      formData['Entrega en oficina o recojo en almacén:'] || '',
      formData['Capacitación o soporte para equipo comercial:'] || ''
    ]);

    // Aplicar fórmula para enlaces
    const lastRow = sheet.getLastRow();
    const fileCell = sheet.getRange(lastRow, 11);
    fileCell.setFormula(filesLinks.join('\n'));

    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Datos procesados correctamente'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');

  } catch (error) {
    Logger.log('Error general: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
  }
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Access-Control-Max-Age', '86400');
} 