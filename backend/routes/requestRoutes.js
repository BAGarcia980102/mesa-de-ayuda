const express = require('express');
const router = express.Router();

// Importar las funciones del controlador
const { registerRequest, getAllRequests, assignRequest } = require('../src/controllers/requestController');

// Rutas para solicitudes
router.post('/requests', registerRequest);  // Crear solicitud
router.get('/requests', getAllRequests);    // Obtener todas las solicitudes
router.put('/requests/:id/assign', assignRequest);  // Asignar solicitud a técnico

module.exports = router;
