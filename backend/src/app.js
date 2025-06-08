// filepath: backend/src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const requestRoutes = require('./routes/requestRoutes');
const { testConnection } = require('./config/temp-config');

const app = express();
app.use(cors());
app.use(express.json());

// Configurar rutas
app.use('/api', requestRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Mesa de Ayuda - Funcionando correctamente');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
const startServer = async () => {
  try {
    // Probar la conexión a la base de datos y crear tablas
    await testConnection();
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
