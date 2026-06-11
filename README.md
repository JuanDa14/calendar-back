# Backend de CalendarApp

API REST para gestión de usuarios, eventos y equipos. Incluye autenticación JWT, verificación de email y recuperación de contraseña.

**Frontend:** [calendar-front](https://github.com/JuanDa14/calendar-front)

## Tech Stack

- Node.js, Express 4
- MongoDB + Mongoose 8
- JWT (access + refresh tokens)
- Nodemailer (Gmail)
- Helmet, rate limiting, CORS

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)
- Cuenta Gmail con contraseña de aplicación (para emails)

## Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/JuanDa14/calendar-back
cd calendar-back

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en desarrollo
npm run dev
```

El servidor estará en `http://localhost:4000`.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (default: 4000) |
| `FRONTEND_URL` | URL del frontend para CORS |
| `MONGO_URI` | Connection string de MongoDB |
| `SECRET_ACCESS_TOKEN` | Secreto JWT access token |
| `SECRET_REFRESH_TOKEN` | Secreto JWT refresh token |
| `MAIL_USER` | Email Gmail para envío |
| `MAIL_PASSWORD` | Contraseña de aplicación Gmail |
| `RESET_PASSWORD` | Ruta frontend reset password |
| `VERIFIED_EMAIL` | Ruta frontend verificación |

## Endpoints principales

### Auth (`/api/user`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/register` | Registrar usuario |
| POST | `/login` | Iniciar sesión |
| GET | `/refresh` | Renovar tokens |
| GET | `/verified/:token` | Verificar email |
| POST | `/forgot-password` | Solicitar reset |
| POST | `/reset-password/:token` | Restablecer contraseña |

### Eventos (`/api/events`) — requiere JWT

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listar eventos |
| POST | `/` | Crear evento |
| PUT | `/:id` | Actualizar evento |
| DELETE | `/:id` | Eliminar evento |

### Equipos (`/api/team`) — requiere JWT

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Eventos del equipo |
| POST | `/` | Crear equipo |
| POST | `/:id` | Agregar miembro |
| POST | `/search/member` | Buscar miembro |
| POST | `/delete/member/:id` | Eliminar miembro |
| DELETE | `/:id` | Eliminar equipo |

### Health check

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado de la API |

## Seguridad

- Helmet para headers HTTP seguros
- Rate limiting (200 req/15min general, 20 req/15min auth)
- CORS restringido a `FRONTEND_URL`
- Validación de datos con express-validator
- JWT con tokens de acceso y refresh

## Checklist de verificación

- [ ] `GET /api/health` responde 200
- [ ] Registro envía email de verificación
- [ ] Login devuelve tokens
- [ ] CRUD de eventos con JWT
- [ ] CRUD de equipos con JWT

## Producción

```bash
npm start
```

## Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://juancode.vercel.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/juan-david-morales-paredes-617342224/)
