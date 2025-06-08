const { createRequest } = require('../models/Request');
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false
});

const registerRequest = async (req, res) => {
  try {
    const requestData = req.body;
    console.log('Datos recibidos en el controlador:', requestData);
    
    const newRequest = await createRequest(requestData);
    console.log('Solicitud creada exitosamente:', newRequest);
    
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (error.code === '23502') {
      res.status(400).json({ error: 'Todos los campos requeridos deben estar presentes' });
    } else if (error.code === '23503') {
      res.status(400).json({ error: 'Referencia a datos no existentes' });
    } else if (error.code === '23505') {
      res.status(400).json({ error: 'Registro duplicado' });
    } else {
      res.status(500).json({ error: 'Error al registrar la solicitud', details: error.message });
    }
  }
};

const getAllRequests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requests ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las solicitudes' });
  }
};

module.exports = { registerRequest, getAllRequests };
