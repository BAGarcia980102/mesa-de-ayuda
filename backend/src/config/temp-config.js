const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mesa_de_ayuda',
  password: 'root',
  port: 5432,
  ssl: false
});

const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Conexión exitosa a PostgreSQL');
  } catch (error) {
    console.error('Error al conectar:', error);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection
};
