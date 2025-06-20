require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false
});

const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('ConexiÃ³n exitosa a PostgreSQL');
  } catch (error) {
    console.error('Error al conectar:', error);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection
};
