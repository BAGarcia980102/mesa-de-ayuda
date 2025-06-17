# Sistema de Mesa de Ayuda

Un sistema web para el manejo de solicitudes de soporte técnico y mantenimiento.

## Requisitos Previos

- Node.js (versión 16 o superior)
- PostgreSQL (versión 14 o superior)
- npm (viene incluido con Node.js)

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd mesa-de-ayuda
```

2. Configurar la base de datos:
   - Crear una base de datos PostgreSQL llamada `mesa_de_ayuda`
   - Ejecutar las migraciones:
   ```bash
   cd backend
   npm install
   npm run migrate
   ```

3. Instalar dependencias del backend:
```bash
cd backend
npm install
```

4. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

## Estructura del Proyecto

```
mesa-de-ayuda/
├── backend/          # Servidor Express
│   ├── src/
│   │   ├── models/  # Modelos de datos
│   │   ├── routes/  # Rutas de la API
│   │   └── controllers/  # Controladores
│   └── package.json
├── frontend/         # Aplicación React
│   ├── src/
│   │   ├── pages/   # Páginas de la aplicación
│   │   └── components/  # Componentes reutilizables
│   └── package.json
└── README.md
```

## Variables de Entorno

Crear un archivo `.env` en la carpeta `backend` con la siguiente configuración:

```env
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mesa_de_ayuda
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

## Ejecución

1. Iniciar el servidor backend:
```bash
cd backend
npm run dev
```

2. Iniciar el servidor frontend:
```bash
cd frontend
npm run dev
```

## Acceso a la Aplicación

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize (ORM)
- CORS
- dotenv
- geolib (para cálculo de distancias)

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- geolocation API (navegador)
- geolocation API (navegador)

## Geolocalización

La aplicación utiliza la geolocalización para determinar la ubicación de los técnicos y actualizar automáticamente el estado de las solicitudes.

## Funcionalidades

- Registro de nuevas solicitudes
- Visualización de solicitudes existentes
- Asignación de técnicos a solicitudes
- Filtros por tipo de solicitud y estado
- Interfaz responsive y moderna

## Geolocalización para Técnicos

- Verificación automática de llegada al destino
- Actualización automática de estado a "En progreso" cuando el técnico llega
- Verificación de ubicación cada 30 segundos
- Manejo de permisos y errores de geolocalización

## Contribución

1. Crea un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
