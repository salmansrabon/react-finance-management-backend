// controllers/costController.js
const Cost = require('../models/cost');

// Create a new cost entry
const createCost = async (req, res) => {
  try {
    const { itemName, quantity, amount, purchaseDate, month, remarks } = req.body;

    // Create a new cost object
    const cost = new Cost({
      itemName,
      quantity,
      amount,
      purchaseDate,
      month,
      remarks,
      userId: req.user._id, // Use the logged-in user's ID from the token
    });

    // Save the cost to the database
    const savedCost = await cost.save();

    res.status(201).json(savedCost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all costs for a user in descending order of purchaseDate
const getAllCosts = async (req, res) => {
  try {
    // Fetch only costs that match the logged-in user's ID
    const costs = await Cost.find({ userId: req.user._id }).sort({ purchaseDate: -1 });
    res.status(200).json(costs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getCostById = async (req, res) => {
    try {
      const cost = await Cost.findById(req.params.id);
  
      if (!cost) {
        return res.status(404).json({ message: 'Cost not found' });
      }
  
      res.status(200).json(cost); // Send back the cost data as response
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// Update a cost by ID
const updateCost = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, quantity, amount, purchaseDate, month, remarks } = req.body;

    // Find and update the cost with matching userId
    const updatedCost = await Cost.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { itemName, quantity, amount, purchaseDate, month, remarks },
      { new: true }
    );

    if (!updatedCost) {
      return res.status(404).json({ message: 'Cost not found' });
    }

    res.status(200).json(updatedCost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a cost by ID
const deleteCost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the cost that matches the user ID
    const deletedCost = await Cost.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!deletedCost) {
      return res.status(404).json({ message: 'Cost not found' });
    }

    res.status(200).json({ message: 'Cost deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createCost, getAllCosts,getCostById, updateCost, deleteCost };
