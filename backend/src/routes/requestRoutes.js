const express = require('express');
const router = express.Router();
const { registerRequest, getAllRequests } = require('../controllers/requestController');

router.post('/requests', registerRequest);
router.get('/requests', getAllRequests);

module.exports = router;
