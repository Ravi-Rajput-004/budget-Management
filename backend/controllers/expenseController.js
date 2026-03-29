import Expense from '../models/Expense.js';
import mongoose from 'mongoose';

export const getExpenses = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }
    
    const expense = await Expense.create({
      title,
      amount,
      category,
      date: date || new Date(),
      userId
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }
    
    const expense = await Expense.findOne({ _id: req.params.id, userId });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    await expense.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseStats = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const stats = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$totalAmount',
          _id: 0
        }
      }
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
