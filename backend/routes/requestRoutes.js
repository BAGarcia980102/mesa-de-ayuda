const express = require('express');
const router = express.Router();

// Importa el controlador correctamente
const { registerRequest } = require('../src/controllers/requestController');

// Define la ruta POST
router.post('/', registerRequest);

module.exports = router;
