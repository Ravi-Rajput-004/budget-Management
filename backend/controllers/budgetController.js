import Budget from '../models/Budget.js';

export const getBudget = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    let budget = await Budget.findOne({ month, year });
    
    if (!budget) {
      budget = await Budget.create({ amount: 0, month, year, threshold: 1000 });
    }
    
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { amount, threshold, month: reqMonth, year: reqYear } = req.body;
    
    const month = reqMonth || new Date().getMonth() + 1;
    const year = reqYear || new Date().getFullYear();
    
    let budget = await Budget.findOne({ month, year });
    
    if (budget) {
      if (amount !== undefined) budget.amount = amount;
      if (threshold !== undefined) budget.threshold = threshold;
      const updatedBudget = await budget.save();
      res.status(200).json(updatedBudget);
    } else {
      const newBudget = await Budget.create({ 
        amount: amount || 0, 
        threshold: threshold || 1000, 
        month, 
        year 
      });
      res.status(201).json(newBudget);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
