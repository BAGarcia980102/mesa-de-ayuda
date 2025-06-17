const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mesa_de_ayuda',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  ssl: false
});

console.log('Conectando a la base de datos con:', {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mesa_de_ayuda',
  port: process.env.DB_PORT || 5432
});

const verifyDatabase = async () => {
  try {
    // Verificar si la tabla technicians existe
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'technicians'
      )
    `);
    
    console.log('Tabla technicians existe:', tableExists.rows[0].exists);

    if (tableExists.rows[0].exists) {
      // Verificar datos en la tabla
      const technicians = await pool.query('SELECT * FROM technicians');
      console.log('Datos en la tabla technicians:', technicians.rows);
    } else {
      console.log('La tabla technicians no existe. Creando...');
      
      // Crear la tabla y los datos de ejemplo
      await pool.query(`
        CREATE TABLE IF NOT EXISTS technicians (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        INSERT INTO technicians (name) VALUES 
            ('Pedro López'),
            ('María García'),
            ('Carlos Rodríguez'),
            ('Ana Martínez'),
            ('Luis Hernández');
      `);

      console.log('Tabla y datos creados exitosamente');
    }
  } catch (error) {
    console.error('Error al verificar la base de datos:', error);
  } finally {
    await pool.end();
  }
};

verifyDatabase();
