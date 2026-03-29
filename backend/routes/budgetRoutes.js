import express from 'express';
import { getBudget, updateBudget } from '../controllers/budgetController.js';

const router = express.Router();

router.route('/').get(getBudget).post(updateBudget).put(updateBudget);

export default router;
