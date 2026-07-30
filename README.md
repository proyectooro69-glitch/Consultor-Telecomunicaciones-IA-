# Consultor de marketing telecom IA

App de diagnóstico estratégico para empresas de telecomunicaciones, con un backend serverless que llama a Groq (modelo `llama-3.3-70b-versatile`, plan gratuito) de forma segura.

## Por qué el despliegue anterior fallaba

- Solo se subió el archivo `.jsx` suelto, sin proyecto (`package.json`, `index.html`, etc.), así que Netlify no tenía nada que construir.
- La llamada al proveedor de IA se hacía directo desde el navegador, lo cual no funciona en producción (no hay clave, y no es seguro exponerla en el cliente de todas formas).

Este proyecto soluciona ambas cosas: es un proyecto Vite completo, y la llamada al modelo pasa por una función serverless (`netlify/functions/consultar.js`) que guarda la clave de API en el servidor, nunca en el navegador.

## Proveedor de IA: Groq Cloud

- Modelo: `llama-3.3-70b-versatile`
- Se llama vía `fetch` directo al endpoint compatible con OpenAI de Groq (`https://api.groq.com/openai/v1/chat/completions`), sin dependencias extra que instalar.
- Se usa `response_format: { type: "json_object" }` para forzar salida JSON válida.
- El plan gratuito de Groq tiene límites de requests por minuto/día — si vas a dar esto a varios clientes a la vez, revisa los límites actuales en https://console.groq.com/settings/limits

## Cómo desplegar

1. Sube TODO este contenido (no solo el .jsx) a tu repo de GitHub, reemplazando lo que había.
2. Crea tu clave gratuita en https://console.groq.com/keys
3. En Netlify, en el proyecto, ve a **Configuración del sitio → Environment variables** y añade:
   - `GROQ_API_KEY` = tu clave de Groq
4. Vuelve a desplegar (Netlify detecta el `netlify.toml` y hace `npm run build` automáticamente).
5. Netlify también detecta la carpeta `netlify/functions` y despliega `consultar.js` como función sin configuración extra.

## Desarrollo local

```
npm install
npm run dev
```

Para probar la función localmente necesitas la CLI de Netlify (`npm install -g netlify-cli` y luego `netlify dev`), porque `npm run dev` solo (Vite) no ejecuta funciones serverless.

## Nota sobre el plan gratuito

El plan gratuito de Groq es generoso pero tiene límites de tasa (requests por minuto y por día, tokens por minuto). Si el proyecto empieza a recibir tráfico real de varios clientes, revisa si necesitas pasar a un plan de pago para evitar que se corten las peticiones en horas pico.
