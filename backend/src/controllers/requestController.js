const { createRequest, assignRequestToTechnician, pool } = require('../models/Request');

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

const assignRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianName } = req.body;

    const updatedRequest = await assignRequestToTechnician(id, technicianName);
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al asignar la solicitud' });
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

module.exports = {
  registerRequest,
  getAllRequests,
  assignRequest
};

module.exports = {
  registerRequest,
  getAllRequests,
  assignRequest
};
