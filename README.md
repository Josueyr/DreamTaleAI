# DreamTaleAI

Aplicación web infantil para crear cuentos personalizados mediante Inteligencia Artificial.

El niño dibuja su edad y un personaje, elige una emoción, y la app genera un cuento interactivo con imágenes ilustradas y narración por voz.

---

## Imágenes

<img width="581" height="478" alt="image" src="https://github.com/user-attachments/assets/be2b51c8-532d-45e0-92cb-3da0ad60baaf" />

---

## Flujo de la aplicación

1. **Pantalla de inicio** — Botón para comenzar la aventura
2. **Dibujar edad** — El niño dibuja un número en el canvas
3. **Dibujar personaje** — Dibuja un animal, robot, dragón, lo que quiera
4. **Elegir emoción** — Selecciona cómo se siente el personaje
5. **Cuento generado** — Libro interactivo con texto, imágenes generadas por IA y narración por voz

---

## Arquitectura

```
DreamTaleAI/
├── src/
│   ├── DreamTaleAI.Core/            # Modelos, interfaces, DTOs
│   ├── DreamTaleAI.Infrastructure/  # Servicios IA (Gemini + mocks)
│   └── DreamTaleAI.Api/             # ASP.NET Core Web API (.NET 8)
└── client/                          # React + TypeScript (Vite)
```

### Servicios de IA (Google Gemini)

| Función | Modelo |
|---|---|
| Reconocer edad dibujada | Gemini 2.5 Flash (Vision) |
| Reconocer personaje dibujado | Gemini 2.5 Flash (Vision) |
| Generar cuento | Gemini 2.5 Flash |
| Generar imágenes por página | Imagen 4 |
| Narración | Web Speech API (navegador) |

---

## Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- API Key de Google Gemini ([obtener aquí](https://aistudio.google.com/app/apikey))

---

## Configuración

### API Key de Gemini

Edita el archivo `src/DreamTaleAI.Api/appsettings.json` y coloca tu API key:

```json
{
  "AI": {
    "UseMocks": false,
    "Gemini": {
      "ApiKey": "TU_API_KEY_AQUI"
    }
  }
}
```

> ⚠️ **Importante:** No subas tu API key a GitHub. El archivo `appsettings.json` ya está en `.gitignore` para protegerla. Si deseas compartir el proyecto, usa variables de entorno o el sistema de [User Secrets de .NET](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets).

Para probar sin API key, cambia `"UseMocks": true`.

---

## Ejecutar el proyecto

### 1. Backend (API)

```bash
cd src/DreamTaleAI.Api
dotnet run
```

La API se inicia en `http://localhost:5000`
Swagger disponible en `http://localhost:5000/swagger`

### 2. Frontend (React)

```bash
cd client
npm install
npm run dev
```

El frontend se inicia en `http://localhost:5173`

### 3. Abrir la app

Ir a `http://localhost:5173` en el navegador.

---

## Endpoints API

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/drawing/recognize-age` | Reconoce número dibujado (edad) |
| POST | `/api/drawing/recognize-character` | Reconoce personaje dibujado |
| POST | `/api/story/generate` | Genera cuento completo con imágenes |
| GET | `/api/images/placeholder` | Imagen SVG placeholder |
| GET | `/api/tts/synthesize` | Info para TTS del navegador |

---

## Tecnologías

**Backend**
- ASP.NET Core 8
- Google Gemini 2.5 Flash (texto + visión)
- Google Imagen 4 (generación de imágenes)

**Frontend**
- React 18 + TypeScript
- Vite
- Web Speech API (narración)

---

## Licencia

MIT
