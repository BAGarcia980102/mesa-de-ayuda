const { createRequest, assignRequestToTechnician, pool, getTechnicians } = require('../models/Request');

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
    
    if (!id || !technicianName) {
      return res.status(400).json({ 
        error: 'Parámetros faltantes', 
        details: 'Se requiere ID de solicitud y nombre de técnico' 
      });
    }

    console.log('Intentando asignar técnico:', {
      requestId: id,
      technicianName: technicianName
    });

    // Primero verificamos si el técnico existe
    const checkTechnicianQuery = `
      SELECT id, name FROM technicians WHERE name = $1;
    `;
    const technicianResult = await pool.query(checkTechnicianQuery, [technicianName]);

    if (technicianResult.rows.length === 0) {
      console.log('Técnico no encontrado:', technicianName);
      return res.status(404).json({ 
        error: 'Técnico no encontrado', 
        details: 'El técnico especificado no existe en la base de datos' 
      });
    }

    // Verificamos si la solicitud existe
    const checkRequestQuery = `
      SELECT id FROM requests WHERE id = $1;
    `;
    const requestResult = await pool.query(checkRequestQuery, [id]);

    if (requestResult.rows.length === 0) {
      console.log('Solicitud no encontrada:', id);
      return res.status(404).json({ 
        error: 'Solicitud no encontrada', 
        details: 'La solicitud especificada no existe' 
      });
    }

    // Actualizamos la solicitud
    const updateQuery = `
      UPDATE requests 
      SET technician_id = $1,
          status = 'Asignada',
          assigned_to = $2
      WHERE id = $3
      RETURNING *;
    `;

    const technicianId = technicianResult.rows[0].id;
    const result = await pool.query(updateQuery, [technicianId, technicianName, id]);
    
    if (result.rows.length === 0) {
      console.log('No se pudo actualizar la solicitud:', id);
      return res.status(500).json({ 
        error: 'Error al actualizar la solicitud', 
        details: 'No se pudo actualizar el registro' 
      });
    }

    console.log('Solicitud actualizada correctamente:', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error detallado en assignRequest:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
};

const getRequestsByTechnician = async (req, res) => {
  try {
    // Obtener el ID del técnico de los parámetros de la URL
    const technicianId = req.params.id;
    console.log('ID del técnico recibido:', technicianId);
    
    // Verificar que el parámetro existe
    if (!technicianId) {
      console.error('Parámetro id no encontrado');
      return res.status(400).json({ error: 'ID de técnico inválido', details: 'Parámetro ID faltante' });
    }

    // Validar que el ID sea un número
    const id = parseInt(technicianId);
    if (isNaN(id)) {
      console.error('ID inválido:', technicianId);
      return res.status(400).json({ error: 'ID de técnico inválido', details: 'El ID no es un número válido' });
    }

    // Verificar que el ID no sea 0 o negativo
    if (id <= 0) {
      console.error('ID fuera de rango:', id);
      return res.status(400).json({ error: 'ID de técnico inválido', details: 'El ID debe ser un número positivo' });
    }

    console.log('Consultando solicitudes para técnico:', id);
    const result = await pool.query(
      'SELECT * FROM requests WHERE technician_id = $1 ORDER BY created_at DESC',
      [id]
    );

    console.log('Solicitudes encontradas:', result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error en getRequestsByTechnician:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    if (error.code === '22P02') {
      return res.status(400).json({ error: 'ID de técnico inválido', details: 'Error de tipo de datos' });
    }
    
    return res.status(500).json({ 
      error: 'Error al obtener las solicitudes del técnico', 
      details: error.message 
    });
  }
};

const getTechniciansList = async (req, res) => {
  try {
    console.log('Recibida petición GET para obtener técnicos');
    const technicians = await getTechnicians();
    console.log('Técnicos encontrados:', technicians);
    res.status(200).json(technicians);
  } catch (error) {
    console.error('Error en getTechniciansList:', error);
    res.status(500).json({ error: 'Error al obtener la lista de técnicos' });
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
  assignRequest,
  getRequestsByTechnician,
  getTechniciansList
};
