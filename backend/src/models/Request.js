const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
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
      (client_name, request_type, reference, plate, observations, company_name, address, contact_name, phone, is_client_owned, asset_tag, fault_description, task_to_perform, documents_to_carry, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
    RETURNING *;
  `;

  // Vamos a enviar 'companyName' como client_name para cumplir con NOT NULL
  const values = [
    companyName || contactName || 'N/A',   // client_name
    requestType,
    reference || '',                       // reference
    '',                                    // plate (no lo usamos ahora)
    '',                                    // observations (no lo usamos ahora)
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
    const result = await pool.query(`
      SELECT id, client_name, request_type, reference, plate, observations, 
             company_name, address, contact_name, phone, is_client_owned, 
             asset_tag, fault_description, task_to_perform, documents_to_carry,
             created_at, assigned_to, status
      FROM requests 
      ORDER BY created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error);
    throw error;
  }
};

const assignRequestToTechnician = async (id, technicianName) => {
  try {
    const result = await pool.query(
      'UPDATE requests SET assigned_to = $1, status = $2 WHERE id = $3 RETURNING *',
      [technicianName, 'Asignada', id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al asignar técnico:', error);
    throw error;
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  assignRequestToTechnician,
  pool
};
