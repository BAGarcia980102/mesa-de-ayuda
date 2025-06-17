const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false
});

const setupDatabase = async () => {
  try {
    // Leer el archivo schema.sql
    const schema = await require('fs').promises.readFile('./database/schema.sql', 'utf-8');
    
    // Ejecutar el schema
    await pool.query(schema);
    
    console.log('Base de datos configurada exitosamente');
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
    throw error;
  } finally {
    // Cerrar la conexión
    await pool.end();
  }
};

// Ejecutar la configuración
setupDatabase();
