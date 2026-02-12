# Solución al error CORS en producción

Cuando la landing (www.inxora.com) consume la API (app.inxora.com), aparece:

```
The 'Access-Control-Allow-Origin' header contains multiple values 'https://www.inxora.com, *', 
but only one is allowed.
```

## Causa

El header `Access-Control-Allow-Origin` se está enviando **dos veces**:
1. Una vez con `https://www.inxora.com` (tu middleware)
2. Otra con `*` (probablemente **nginx** o otro proxy)

La especificación CORS solo permite **un único valor** para este header.

## Solución en el backend (app.inxora.com)

### 1. Revisar nginx

Si nginx está delante de FastAPI, **quita** cualquier directiva `add_header` relacionada con CORS:

```nginx
# ❌ ELIMINAR o comentar estas líneas si existen:
# add_header Access-Control-Allow-Origin *;
# add_header Access-Control-Allow-Origin $http_origin;
# add_header Access-Control-Allow-Methods "GET, POST, ...";
```

Nginx puede estar añadiendo headers aunque ya los envíe FastAPI. Revisa:
- `/etc/nginx/sites-available/` 
- `/etc/nginx/nginx.conf`
- Cualquier `include` de configs

### 2. Evitar duplicados en el middleware

Tu `CORSDebugMiddleware` ya intenta eliminar headers existentes. Asegúrate de que:

- Se ejecute **después** de cualquier otro middleware que pueda añadir CORS
- El orden en FastAPI: el último `add_middleware` se ejecuta primero en el request y último en el response

```python
# El middleware agregado al final procesa el response primero
app.add_middleware(CORSDebugMiddleware)  # Este debe ser el ÚLTIMO add_middleware
```

### 3. Revisar respuestas de redirección (307)

El endpoint `/api/categorias` devuelve **307** hacia `/api/categorias/`. La respuesta de redirección también puede tener headers CORS duplicados. Opciones:

- **En FastAPI**: Asegurar que la ruta acepte tanto `/api/categorias` como `/api/categorias/` para evitar el redirect
- **En el frontend**: Usar la URL con trailing slash (ya aplicado en `appConfig.ts`)

### 4. Deshabilitar CORS en otros lugares

Revisa que no haya:
- Otro middleware de CORS
- Configuración en un proxy/load balancer (Cloudflare, etc.)
- Headers añadidos en un reverse proxy

## Verificación

Tras los cambios, en las herramientas de desarrollo del navegador (Network):

1. Petición a `https://app.inxora.com/api/categorias/`
2. En Response Headers buscar `Access-Control-Allow-Origin`
3. Debe aparecer **una sola vez** con valor `https://www.inxora.com`

## Errores adicionales (no relacionados con tu código)

- **`beacon.min.js net::ERR_BLOCKED_BY_CLIENT`** → Bloqueado por extensiones (adblock, etc.)
- **`fbevents.js net::ERR_BLOCKED_BY_CLIENT`** → Bloqueado por extensiones (adblock, etc.)

Estos son bloqueos del navegador/extensions, no errores de la aplicación.
