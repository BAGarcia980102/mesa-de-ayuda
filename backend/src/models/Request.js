const { Pool } = require('pg');

console.log('Conectando a la base de datos con:', {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mesa_de_ayuda',
  port: process.env.DB_PORT || 5432
});

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mesa_de_ayuda',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  ssl: false
});

const createRequest = async (data) => {
  const {
    companyName,
    address,
    contactName,
    phone,
    requestType,
    reference,
    isClientOwned,
    assetTag,
    faultDescription,
    taskToPerform,
    documentsToCarry
  } = data;

  // Mapeamos companyName y contactName a client_name y contact_name
  const query = `
    INSERT INTO requests 
      (request_type, reference, company_name, address, contact_name, phone, is_client_owned, asset_tag, fault_description, task_to_perform, documents_to_carry, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    RETURNING *;
  `;

  // Vamos a enviar 'companyName' como client_name para cumplir con NOT NULL
  const values = [
    requestType,
    reference || '',                       // reference
    companyName || '',                     // company_name
    address || '',                         // address
    contactName || '',                     // contact_name
    phone || '',                           // phone
    isClientOwned || false,                // is_client_owned
    assetTag || '',                        // asset_tag
    faultDescription || '',                // fault_description
    taskToPerform || '',                   // task_to_perform
    documentsToCarry || ''                 // documents_to_carry
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllRequests = async () => {
  try {
    console.log('Ejecutando consulta para obtener solicitudes...');
    const result = await pool.query(`
      SELECT 
        r.id,
        r.company_name,
        r.contact_name,
        r.phone,
        r.request_type,
        r.reference,
        r.is_client_owned,
        r.asset_tag,
        r.fault_description,
        r.task_to_perform,
        r.documents_to_carry,
        r.created_at,
        r.status,
        r.address,
        r.technician_id,
        r.assigned_to,
        t.name as technician_name,
        r.status
      FROM requests r
      LEFT JOIN technicians t ON r.technician_id = t.id
      ORDER BY r.created_at DESC
    `);

    console.log('Resultados de la consulta:', result.rows);
    
    // Asegurarnos de que documents_to_carry sea un array
    const requests = result.rows.map(req => {
      console.log('Procesando solicitud:', {
        id: req.id,
        technician_id: req.technician_id,
        technician_name: req.technician_name,
        assigned_to: req.assigned_to
      });
      
      return {
        id: req.id,
        company_name: req.company_name,
        contact_name: req.contact_name,
        phone: req.phone,
        request_type: req.request_type,
        reference: req.reference,
        is_client_owned: req.is_client_owned,
        asset_tag: req.asset_tag,
        fault_description: req.fault_description,
        task_to_perform: req.task_to_perform,
        documents_to_carry: Array.isArray(req.documents_to_carry) 
          ? req.documents_to_carry 
          : req.documents_to_carry ? [req.documents_to_carry] : [],
        created_at: req.created_at,
        status: req.status,
        address: req.address,
        technician_id: req.technician_id || null,
        technician_name: req.technician_name || req.assigned_to || null,
        assigned_to: req.assigned_to
      };
    });

    console.log('Solicitudes procesadas:', requests);
    return requests;
  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

const assignRequestToTechnician = async (id, technicianName) => {
  // Validar parámetros
  if (!id || !technicianName) {
    throw new Error('Parámetros faltantes: se requiere ID y nombre de técnico');
  }

  // Verificar que el técnico existe
  const checkTechnicianQuery = `
    SELECT id, name FROM technicians WHERE name = $1;
  `;
  const technicianResult = await pool.query(checkTechnicianQuery, [technicianName]);
  
  if (technicianResult.rows.length === 0) {
    throw new Error('Técnico no encontrado');
  }

  // Obtener el ID del técnico
  const technicianId = technicianResult.rows[0].id;
  const technicianNameFromDB = technicianResult.rows[0].name;

  // Actualizar la solicitud
  const updateQuery = `
    UPDATE requests 
    SET technician_id = $1,
        status = 'Asignada',
        assigned_to = $2,
        technician_name = $2
    WHERE id = $3
    RETURNING *;
  `;

  const result = await pool.query(updateQuery, [technicianId, technicianNameFromDB, id]);
  
  if (result.rows.length === 0) {
    throw new Error('No se pudo actualizar la solicitud');
  }

  console.log('Solicitud actualizada:', result.rows[0]);
  return result.rows[0];
};

const getTechnicians = async () => {
  const query = `
    SELECT id, name 
    FROM technicians 
    ORDER BY name
  `;

  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createRequest,
  getAllRequests,
  assignRequestToTechnician,
  getTechnicians,
  pool
};
