require('dotenv').config(); // Cargar desde el archivo .env en el directorio raíz

const app = require('./src/app');
const PORT = process.env.PORT || 5001; // Cambiar el puerto base a 5001
const backupPorts = [5001, 5002, 5003, 5004, 5005];
let currentPort = PORT;

console.log('Intentando iniciar el servidor en el puerto:', currentPort);

function startServer() {
  app.listen(currentPort, () => {
    console.log(`Server is running on port ${currentPort}`);
  }).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${currentPort} is already in use`);
      const nextPort = backupPorts.shift();
      if (nextPort) {
        currentPort = nextPort;
        console.log(`Trying next backup port: ${currentPort}`);
        startServer();
      } else {
        console.error('No available ports to try');
        process.exit(1);
      }
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });
}

startServer();

// Asegurar que el proceso se detenga correctamente al recibir una señal de término
process.on('SIGINT', () => {
  console.log('Deteniendo el servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Deteniendo el servidor...');
  process.exit(0);
});

// Verificar variables de entorno
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Error: Las siguientes variables de entorno son requeridas pero no están definidas:', missingEnvVars);
  process.exit(1);
}


