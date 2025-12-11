# Chat Web

Aplicación simple de chat global con posts, comentarios y reacciones.

Estructura:
- `backend`: API REST + Socket.IO (Express, MongoDB Atlas)
- `frontend`: SPA en React con Vite

Requisitos:
- Node.js 18+
- MongoDB Atlas URI

Configuración rápida:
1. Clonar/abrir el proyecto.

```powershell
cd backend
copy .env.example .env
# editar .env y poner MONGO_URI y JWT_SECRET
npm install
npm run dev
```

Frontend:
```powershell
cd frontend
npm install
npm run dev
```

- Frontend corre por defecto en `http://localhost:5173`.
- Backend corre en `http://localhost:4000`.

Uso:
- Regístrate o inicia sesión.
- Serás enviado al chat global (mensajes en tiempo real via Socket.IO).
- También puedes crear publicaciones, comentar y reaccionar.

 
 Nota: He creado un archivo `backend/.env` de ejemplo usando la URI que me proporcionaste (usuario `deleon` y contraseña `deleon`) para pruebas locales. Esto funciona para desarrollo, pero por seguridad **cámbialo** antes de poner la app en producción.
 
 Si prefieres regenerar `.env` desde la plantilla, elimina `backend/.env` y ejecuta:
 ```powershell
 cd backend
 copy .env.example .env
 # editar .env
 ```
