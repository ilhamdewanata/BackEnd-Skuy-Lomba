const express = require('express');
const router = express.Router();
const lombaController = require('../controller/lomba.controller'); // Adjust the path as necessary

// Routes
router.get('/', lombaController.findAll); // Retrieve all Lomba with pagination
router.post('/', lombaController.create); // Create a new Lomba
router.get('/:id', lombaController.findOne); // Retrieve a single Lomba by ID
router.put('/:lombaId/:userId', lombaController.update); // Update an existing Lomba
router.delete('/:id', lombaController.remove); // Delete a Lomba by ID
router.patch('/:lombaId/toggle', lombaController.toggleIsActive); // Toggle the is_active status of a Lomba
router.patch('/:lombaId/views', lombaController.incrementViews); // Increment the views count of a Lomba

module.exports = router;
