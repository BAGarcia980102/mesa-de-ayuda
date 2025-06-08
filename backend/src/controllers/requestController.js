const { createRequest } = require('../models/Request');

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

module.exports = { registerRequest };
