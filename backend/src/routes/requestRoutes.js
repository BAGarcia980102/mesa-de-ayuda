const express = require('express');
const router = express.Router();
const { registerRequest, getAllRequests, assignRequest, getRequestsByTechnician, getTechniciansList } = require('../controllers/requestController');

router.post('/requests', registerRequest);
router.get('/requests', getAllRequests);
router.put('/requests/:id/assign', assignRequest);
router.get('/requests/technician/:id', getRequestsByTechnician);
router.get('/technicians', getTechniciansList);

module.exports = router;
