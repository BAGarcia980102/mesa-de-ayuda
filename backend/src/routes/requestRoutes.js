const express = require('express');
const router = express.Router();
const { registerRequest, getAllRequests, assignRequest } = require('../controllers/requestController');

router.post('/requests', registerRequest);
router.get('/requests', getAllRequests);
router.put('/requests/:id/assign', assignRequest);

module.exports = router;
