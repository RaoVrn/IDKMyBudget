const Expense = require('../models/expenseModel');
const mongoose = require('mongoose');

// Get all expenses for a user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .sort({ date: -1 })
      .exec();
    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ success: false, message: 'Error fetching expenses' });
  }
};

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const expense = new Expense({
      user: req.user.id,
      title: req.body.title,
      amount: req.body.amount,
      category: req.body.category,
      date: new Date()
    });
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ success: false, message: 'Error adding expense' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid expense ID format' });
    }

    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this expense' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting expense' });
  }
};
