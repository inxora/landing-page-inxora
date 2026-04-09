# Proxy API para evitar CORS

La landing consume la API de api.inxora.com mediante **proxy** (mismo patrón que ecommerce-inxora). El navegador hace fetch a `/api/categorias/` (mismo origen) y el servidor/proxy reenvía a api.inxora.com. Así se evita CORS.

## Configuración por plataforma

### Desarrollo (Vite)
El `vite.config.ts` ya tiene el proxy configurado. `npm run dev` hace que `/api/*` se reenvíe a api.inxora.com.

### Vercel
`vercel.json` define rewrites con `/api/(.*)` → `https://api.inxora.com/api/$1`.

**Si recibes 404 en producción:**
1. Verifica que `vercel.json` esté en la raíz del proyecto y desplegado
2. En Vercel Dashboard → Project Settings → General: confirma que "Root Directory" sea el correcto (vacío si el repo es solo la landing)
3. Si usas monorepo, Root Directory debe apuntar a la carpeta de la landing
4. Redeploy después de cambiar `vercel.json`

### Netlify
`netlify.toml` y `public/_redirects` configuran el proxy. Cualquiera de los dos funciona.

### Cloudflare Pages
Cloudflare Pages no tiene proxy nativo para URLs externas. Opciones:

1. **Cloudflare Worker** delante de www.inxora.com que haga proxy de `/api/*` a api.inxora.com
2. **Modificar la API** para que el backend sea la única fuente de headers CORS (sin duplicados desde nginx)

### Nginx (deploy propio)
Si la landing está en el mismo servidor que nginx, agregar:

```nginx
location /api/ {
    proxy_pass https://api.inxora.com;
    proxy_http_version 1.1;
    proxy_set_header Host api.inxora.com;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## URL base

- **Config**: `APP_CONFIG.API_CATEGORIAS = '/api/categorias/'`
- Siempre ruta relativa → mismo origen → sin CORS
