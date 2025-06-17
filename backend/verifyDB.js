const { Pool } = require('pg');
require('dotenv').config();

console.log('Conectando a la base de datos con las siguientes credenciales:');
console.log('Usuario:', process.env.DB_USER);
console.log('Host:', process.env.DB_HOST);
console.log('Base de datos:', process.env.DB_NAME);
console.log('Puerto:', process.env.DB_PORT);
console.log('Ambiente:', process.env.NODE_ENV);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false
});

const verifyDatabase = async () => {
  try {
    console.log('Verificando y creando tabla de técnicos...');
    
    // Crear la tabla si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS technicians (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insertar los técnicos específicos si no existen
    const technicians = [
      'DANIEL DIAZ',
      'ANDERSSON FLOR',
      'BREYNER LONDONO',
      'LUIS ÑAÑEZ',
      'CARLOS LUJAN',
      'ANA ORTIZ'
    ];

    for (const technician of technicians) {
      try {
        await pool.query(`
          INSERT INTO technicians (name)
          SELECT $1
          WHERE NOT EXISTS (
            SELECT 1 FROM technicians WHERE name = $1
          )
        `, [technician]);
        console.log(`Técnico ${technician} agregado exitosamente`);
      } catch (error) {
        console.log(`Error al agregar técnico ${technician}:`, error.message);
      }
    }

    // Verificar los datos insertados
    const techniciansResult = await pool.query('SELECT * FROM technicians ORDER BY name');
    console.log('Técnicos en la base de datos:', techniciansResult.rows);
    console.log('Técnicos en la base de datos:', techniciansResult.rows);

  } catch (error) {
    console.error('Error al crear la tabla de técnicos:', error);
  } finally {
    await pool.end();
  }
};

verifyDatabase();
