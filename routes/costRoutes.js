// routes/costRoutes.js
const express = require('express');
const { createCost, getAllCosts, updateCost, deleteCost, getCostById } = require('../controllers/costController');
const { protect } = require('../middleware/authMiddleware'); // Protect routes with middleware
const router = express.Router();

router.post('/', protect, createCost); // Create a new cost
router.get('/', protect, getAllCosts); // Get all costs for the logged-in user
router.get('/:id', protect, getCostById); // Get a cost by ID
router.put('/:id', protect, updateCost); // Update a cost by ID
router.delete('/:id', protect, deleteCost); // Delete a cost by ID

module.exports = router;
