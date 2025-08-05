# 🚀 Landing Page – Magic Patterns

Landing page desarrollada con [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) y [Keen Slider](https://keen-slider.io/), basada en componentes de Magic Patterns.

---

## 📦 Instalación

Ejecuta los siguientes comandos en tu terminal para instalar las dependencias:

```bash
npm install
```

> También puedes instalar manualmente los paquetes principales:

```bash
# Dependencias principales
npm install react react-dom lucide-react keen-slider

# Dependencias de desarrollo
npm install --save-dev typescript vite @types/react @types/react-dom @types/prop-types

# Tailwind CSS y configuraciones de post-procesado
npm install -D tailwindcss postcss autoprefixer
```

---

## 💻 Desarrollo local


Para iniciar el servidor de desarrollo y permitir el acceso desde otras computadoras (por ejemplo, para acceder desde tu navegador usando la IP del VPS), ejecuta:

```bash
npm run dev -- --host
```

Esto abrirá la aplicación en `http://<IP_DE_TU_SERVIDOR>:5173` (o el puerto indicado en la terminal).  
Puedes modificar el contenido desde los archivos `.tsx` y los estilos con Tailwind.

---

## 🚀 Despliegue en producción

Para compilar el proyecto:

```bash
npm run build
```

Esto generará una carpeta `dist/` con los archivos listos para producción.

### Opciones para servir el proyecto:

#### 🔹 Usar Vite Preview (modo prueba)

```bash
npm run preview
```

#### 🔹 Servir con un servidor estático

Sube la carpeta `dist/` a un servidor VPS o hosting y configúralo con Nginx, Apache o la herramienta `serve`.

> Para despliegues en VPS con acceso por SSH, puedes usar Visual Studio Code con la extensión **Remote Explorer**, o herramientas como `scp` o `rsync` para transferir archivos.

---

## 🧠 Documentación recomendada

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Keen Slider Docs](https://keen-slider.io/docs)

---

## 📬 Soporte

Para dudas, mejoras o colaboración, abre un issue o contacta al desarrollador.

---

## 🛠️ Estructura y Guía Técnica del Proyecto

### Estructura de Carpetas (src/components)

- **Hero/**: HeroSection principal (título, subtítulo, logo, botones).
- **Header/**: Navbar, menú responsive, selector de idioma, enlaces principales.
- **Solution/**: Sección de solución/ventajas.
- **HowItWorks/**: Explicación de funcionamiento paso a paso.
- **Products/**: Catálogo de productos, slider responsive.
- **Persuasion/**: Beneficios para clientes, slider de logos de clientes.
- **Providers/**: Formulario y slider de proveedores.
- **Reconocimientos/**: Sección de reconocimientos y premios.
- **Sara/**: Sección de Sara Xora (IA), burbujas animadas.
- **CTA/**: Sección de contacto y formulario de clientes.
- **Footer/**: Footer, enlaces legales, libro de reclamaciones.
- **Loader.tsx**: Loader animado al inicio.
- **NotFound404.tsx**: Página de error 404.
- **ScrollToTop.tsx**: Componente para scroll automático al navegar.

### Componentes y Flujos Clave

- **Formularios (Clientes y Proveedores):**
  - Integración con APIs de SUNAT y RENIEC para autocompletar datos (DNI/RUC).
  - Manejo de errores y desbloqueo de campos si la API falla o se excede el límite.
  - Subida de archivos (Excel, PDF, imágenes) con validaciones de tipo y tamaño.
  - Envío de datos a Google Sheets vía Google Apps Script (modo no-cors).
  - Mensajes de feedback claros y accesibles.

- **Sliders (Keen Slider):**
  - Usados en Products, Persuasion y Providers.
  - Configuración responsive y autoplay.
  - Efecto visual limpio, sin saltos ni rebotes.

- **Responsividad:**
  - Todo el landing es 100% responsive (mobile, tablet, desktop, ultra-wide).
  - Uso intensivo de Tailwind CSS y breakpoints (`sm`, `md`, `lg`).
  - Layouts adaptativos en Hero, sliders, formularios y footer.

- **Fuentes y Branding:**
  - Fuentes principales: Orbitron (títulos, botones), Montserrat (descripciones).
  - Colores y gradientes alineados a la identidad de INXORA.

- **Legal y privacidad:**
  - Footer con enlaces a Aviso Legal, Política de Privacidad, Cookies y Términos.
  - Libro de Reclamaciones virtual, 100% responsive y accesible.

### Puntos Importantes a Tener en Cuenta

- **No modificar directamente los archivos de traducción sin validar las claves en todos los idiomas.**
- **Al agregar nuevos componentes, seguir la convención de carpetas y usar Tailwind para responsividad.**
- **Mantener la accesibilidad:**
  - Etiquetas `label` asociadas a inputs.
  - Mensajes de error claros.
  - Navegación con teclado y lectores de pantalla.
- **Optimizar imágenes:**
  - Usar formatos comprimidos y tamaños adecuados.
  - Revisar rutas relativas en producción.
- **Evitar efectos visuales bruscos:**
  - No abusar de `hover:scale` en sliders.
  - Mantener transiciones suaves.
- **Revisar el funcionamiento de los formularios tras cambios en Google Apps Script o APIs externas.**
- **Probar siempre en diferentes resoluciones antes de publicar.**

---
