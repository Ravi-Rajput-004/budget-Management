import express from 'express';
import { getExpenses, addExpense, deleteExpense, getExpenseStats } from '../controllers/expenseController.js';

const router = express.Router();

router.route('/').get(getExpenses).post(addExpense);
router.route('/stats').get(getExpenseStats);
router.route('/:id').delete(deleteExpense);

export default router;
