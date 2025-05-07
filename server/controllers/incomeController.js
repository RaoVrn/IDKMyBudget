const Income = require('../models/incomeModel');
const mongoose = require('mongoose');

// Get all income entries for a user
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id })
      .sort({ date: -1 })
      .exec();
    res.json(incomes);
  } catch (error) {
    console.error('Get incomes error:', error);
    res.status(500).json({ success: false, message: 'Error fetching income entries' });
  }
};

// Add a new income entry
exports.addIncome = async (req, res) => {
  try {
    const income = new Income({
      user: req.user.id,
      title: req.body.title,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date || new Date(),
      recurring: req.body.recurring || false,
      recurringFrequency: req.body.recurringFrequency || 'monthly'
    });
    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    console.error('Add income error:', error);
    res.status(500).json({ success: false, message: 'Error adding income entry' });
  }
};

// Update an income entry
exports.updateIncome = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid income ID format' });
    }

    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ success: false, message: 'Income entry not found' });
    }

    if (income.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this income entry' });
    }

    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedIncome,
      message: 'Income entry updated successfully'
    });
  } catch (error) {
    console.error('Update income error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating income entry' });
  }
};

// Delete an income entry
exports.deleteIncome = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid income ID format' });
    }

    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ success: false, message: 'Income entry not found' });
    }

    if (income.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this income entry' });
    }

    await Income.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Income entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting income entry' });
  }
};