const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false
});

const fixTechnicians = async () => {
  try {
    console.log('Iniciando proceso de limpieza de técnicos duplicados...');

    // Obtener todos los técnicos ordenados por nombre y fecha de creación
    const technicians = await pool.query(`
      SELECT id, name, created_at
      FROM technicians
      ORDER BY name, created_at DESC
    `);

    // Crear un mapa para almacenar el ID más reciente de cada técnico
    const latestTechnicians = new Map();

    // Llenar el mapa con los técnicos más recientes
    for (const tech of technicians.rows) {
      latestTechnicians.set(tech.name, tech.id);
    }

    // Eliminar todos los técnicos excepto los más recientes
    for (const tech of technicians.rows) {
      if (latestTechnicians.get(tech.name) !== tech.id) {
        await pool.query('DELETE FROM technicians WHERE id = $1', [tech.id]);
        console.log(`Eliminado técnico duplicado con ID ${tech.id}: ${tech.name}`);
      }
    }

    // Verificar los técnicos restantes
    const remainingTechnicians = await pool.query('SELECT * FROM technicians ORDER BY name');
    console.log('Técnicos después de la limpieza:', remainingTechnicians.rows);

  } catch (error) {
    console.error('Error al limpiar técnicos duplicados:', error);
  } finally {
    await pool.end();
  }
};

fixTechnicians();
