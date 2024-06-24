const express = require('express');
const router = express.Router();
const pendaftaranController = require('../controller/pendaftaran.controller'); // Adjust the path as necessary

// Routes
router.post('/', pendaftaranController.create); // Create Kategorisasi entries
router.get('/:id/users', pendaftaranController.findByIdUser);
router.get('/:id/lomba', pendaftaranController.findByIdLomba);
router.get('/:id/pendaftar', pendaftaranController.countByIdLomba);

module.exports = router;
