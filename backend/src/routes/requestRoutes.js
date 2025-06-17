const express = require('express');
const router = express.Router();
const { registerRequest, getAllRequests, assignRequest, updateRequestStatus, getRequestsByTechnician, getTechniciansList, updateStatusByLocation } = require('../controllers/requestController');

router.post('/requests', registerRequest);
router.get('/requests', getAllRequests);
router.put('/requests/:id/assign', assignRequest);
router.put('/requests/:id/status', updateRequestStatus);
router.get('/requests/technician/:id', getRequestsByTechnician);
router.get('/technicians', getTechniciansList);
router.put('/requests/:id/auto-status', updateStatusByLocation);

module.exports = router;
