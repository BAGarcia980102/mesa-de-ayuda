require('dotenv').config({ path: './src/config/.env' });

const app = require('./src/app');
const PORT = process.env.PORT || 3001;

// Verificar variables de entorno
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Error: Las siguientes variables de entorno son requeridas pero no están definidas:', missingEnvVars);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
