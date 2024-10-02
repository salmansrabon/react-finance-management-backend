const Cost = require('../models/cost'); // Sequelize model

// Create a new cost entry
const createCost = async (req, res) => {
  try {
    const { itemName, quantity, amount, purchaseDate, month, remarks } = req.body;

    // Create a new cost object using Sequelize
    const newCost = await Cost.create({
      itemName,
      quantity,
      amount,
      purchaseDate,
      month,
      remarks,
      userId: req.user._id, // Use the logged-in user's ID from the token
    });

    res.status(201).json(newCost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all costs for a user in descending order of purchaseDate
const getAllCosts = async (req, res) => {
  try {
    // Fetch costs that match the logged-in user's ID
    const costs = await Cost.findAll({
      where: { userId: req.user._id },
      order: [['purchaseDate', 'DESC']],
    });
    res.status(200).json(costs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a cost by ID
const getCostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find cost by primary key
    const cost = await Cost.findByPk(id);

    if (!cost) {
      return res.status(404).json({ message: 'Cost not found' });
    }

    res.status(200).json(cost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a cost by ID
const updateCost = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, quantity, amount, purchaseDate, month, remarks } = req.body;

    // Find and update the cost entry
    const [updatedRowsCount] = await Cost.update(
      { itemName, quantity, amount, purchaseDate, month, remarks },
      { where: { _id: id, userId: req.user._id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Cost not found' });
    }

    // Retrieve the updated cost entry
    const updatedCost = await Cost.findByPk(id);

    res.status(200).json(updatedCost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a cost by ID
const deleteCost = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the cost entry that matches the user ID
    const deletedRowsCount = await Cost.destroy({ where: { _id: id, userId: req.user._id } });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: 'Cost not found' });
    }

    res.status(200).json({ message: 'Cost deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createCost, getAllCosts, getCostById, updateCost, deleteCost };
