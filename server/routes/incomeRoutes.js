const express = require('express');
const { getIncomes, addIncome, updateIncome, deleteIncome } = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getIncomes)
  .post(protect, addIncome);

router.route('/:id')
  .put(protect, updateIncome)
  .delete(protect, deleteIncome);

module.exports = router;