import React, { useState, useEffect } from 'react';
import { PlusCircle, Sliders, Tag, IndianRupee, Layers } from 'lucide-react';
import Swal from 'sweetalert2';

const ExpenseForm = ({ onAdd, onBudgetUpdate, currentBudget, totalSpent }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [budgetAmount, setBudgetAmount] = useState(currentBudget?.amount || 0);
  const [threshold, setThreshold] = useState(currentBudget?.threshold || 0);

  useEffect(() => {
    setBudgetAmount(currentBudget?.amount || 0);
    setThreshold(currentBudget?.threshold || 0);
  }, [currentBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const expenseAmount = parseFloat(amount);
    const currentBalance = (currentBudget?.amount || 0) - totalSpent;
    const futureBalance = currentBalance - expenseAmount;

    if (futureBalance < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Insufficient Balance',
        text: `You clearly don't have enough funds. This payment of ₹${expenseAmount} exceeds your current balance of ₹${currentBalance.toFixed(2)}.`,
        confirmButtonColor: 'var(--danger)'
      });
      return;
    }

    if (futureBalance < threshold) {
      const result = await Swal.fire({
        title: 'Low Balance Warning',
        text: `This payment of ₹${expenseAmount} will bring your balance to ₹${futureBalance.toFixed(2)}, which is below your ₹${threshold} limit. Proceed anyway?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--primary)',
        cancelButtonColor: 'var(--secondary)',
        confirmButtonText: 'Yes, pay it',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) return;
    }

    onAdd({ title, amount: expenseAmount, category });
    handleClear();
  };

  const handleClear = () => {
    setTitle('');
    setAmount('');
    setCategory('Food');
    setBudgetAmount('');
    setThreshold('');
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    if (!budgetAmount || !threshold) {
      Swal.fire({ icon: 'warning', title: 'Empty Fields', text: 'Please enter budget and threshold values.' });
      return;
    }
    onBudgetUpdate({ amount: parseFloat(budgetAmount), threshold: parseFloat(threshold) });
  };

  return (
    <div className="grid">
      <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Add Expense</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Title</label>
            <div className="input-group">
              <input 
                className="input" 
                placeholder="Rent, Groceries..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Tag size={18} className="input-icon" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="label">Amount</label>
              <div className="input-group">
                <input 
                  className="input" 
                  type="number" 
                  placeholder="0.00" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <IndianRupee size={18} className="input-icon" />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Category</label>
              <div className="input-group">
                <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Housing">Housing</option>
                  <option value="Other">Other</option>
                </select>
                <Layers size={18} className="input-icon" />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              <PlusCircle size={18} /> Record Expense
            </button>
            <button 
              type="button" 
              onClick={handleClear} 
              className="btn btn-outline" 
              style={{ flex: 1, borderColor: 'var(--secondary)', color: 'var(--text-muted)' }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="card animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Budget Settings</h3>
        <form onSubmit={handleBudgetSubmit}>
          <div className="form-group">
            <label className="label">Set Monthly Budget Amount</label>
            <div className="input-group">
              <input 
                className="input" 
                type="number" 
                value={budgetAmount} 
                onChange={(e) => setBudgetAmount(e.target.value)}
                required
              />
              <IndianRupee size={18} className="input-icon" />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Low Balance Alert Threshold</label>
            <div className="input-group">
              <input 
                className="input" 
                type="number" 
                value={threshold} 
                onChange={(e) => setThreshold(e.target.value)}
                required
              />
              <IndianRupee size={18} className="input-icon" />
            </div>
          </div>
          <button type="submit" className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem' }}>
            <Sliders size={18} /> Update Limits
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
