const Budget = require('../models/budgetModel');
const Expense = require('../models/expenseModel');
const mongoose = require('mongoose');

// Get all budgets for a user
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ category: 1 });
    res.json(budgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ message: 'Error fetching budgets' });
  }
};

// Add a new budget
exports.addBudget = async (req, res) => {
  try {
    // Check if budget for this category already exists
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category: req.body.category
    });

    if (existingBudget) {
      return res.status(400).json({
        message: `Budget for ${req.body.category} already exists`
      });
    }

    const budget = new Budget({
      user: req.user.id,
      category: req.body.category,
      amount: req.body.amount,
      period: req.body.period || 'monthly',
      alert: {
        enabled: req.body.alert?.enabled ?? true,
        threshold: req.body.alert?.threshold ?? 80
      }
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    console.error('Add budget error:', error);
    res.status(500).json({ message: 'Error adding budget' });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this budget' });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      {
        amount: req.body.amount,
        period: req.body.period,
        alert: {
          enabled: req.body.alert?.enabled,
          threshold: req.body.alert?.threshold
        }
      },
      { new: true }
    );

    res.json(updatedBudget);
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ message: 'Error updating budget' });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this budget' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ message: 'Error deleting budget' });
  }
};

// Get budget status for all categories
exports.getBudgetStatus = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    
    // Get current date info
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get monthly expenses
    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Calculate budget status for each category
    const budgetStatus = budgets.map(budget => {
      const expenses = monthlyExpenses.find(exp => exp._id === budget.category) || { total: 0 };
      const percentage = (expenses.total / budget.amount) * 100;
      const isExceeding = percentage > 100;
      const isNearLimit = percentage >= budget.alert.threshold;

      return {
        category: budget.category,
        budgetAmount: budget.amount,
        spent: expenses.total,
        percentage,
        remaining: budget.amount - expenses.total,
        status: isExceeding ? 'exceeding' : isNearLimit ? 'warning' : 'ok',
        alert: {
          enabled: budget.alert.enabled,
          threshold: budget.alert.threshold
        }
      };
    });

    res.json(budgetStatus);
  } catch (error) {
    console.error('Get budget status error:', error);
    res.status(500).json({ message: 'Error getting budget status' });
  }
};