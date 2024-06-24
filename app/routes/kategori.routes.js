const express = require('express');
const router = express.Router();
const kategoriController = require('../controller/kategori.controller'); // Adjust the path as necessary

// Routes
router.get('/', kategoriController.findAll); // Retrieve all Kategori
router.get('/:id', kategoriController.findOne); // Retrieve all Kategori
router.post('/', kategoriController.create); // Create a new Kategori
router.delete('/:id', kategoriController.remove); // Delete a Kategori by ID

module.exports = router;
