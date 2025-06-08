const express = require('express');
const router = express.Router();
const { registerRequest } = require('../controllers/requestController');

router.post('/requests', registerRequest);

module.exports = router;
