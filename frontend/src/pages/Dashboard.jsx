import React, { useState, useEffect } from 'react';
import { budgetService, expenseService } from '../services/api';
import BudgetSummary from '../components/BudgetSummary';
import ExpenseForm from '../components/ExpenseForm';
import CategoryChart from '../components/CategoryChart';
import RecentExpenses from '../components/RecentExpenses';
import { LayoutDashboard, Calendar, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [budget, setBudget] = useState({ amount: 0, threshold: 1000 });
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slowLoading, setSlowLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setIsUpdating(true);
      
      setError(null);
      const [budgetRes, expensesRes, statsRes] = await Promise.all([
        budgetService.getBudget(currentMonth, currentYear),
        expenseService.getExpenses(currentMonth, currentYear),
        expenseService.getStats(currentMonth, currentYear)
      ]);
      setBudget(budgetRes.data);
      setExpenses(expensesRes.data);
      setStats(statsRes.data);
      
      setLoading(false);
      setIsUpdating(false);
      setSlowLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch data');
      setLoading(false);
      setIsUpdating(false);
      setSlowLoading(false);
    }
  };

  useEffect(() => {
    let timeoutId;
    if (loading && !budget.amount) {
      timeoutId = setTimeout(() => {
        setSlowLoading(true);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [loading, budget.amount]);

  useEffect(() => {
    fetchData(); // Initial load - full page spinner
  }, []);

  useEffect(() => {
    if (loading === false) {
      fetchData(true); // Silent load when month/year changes
    }
  }, [currentMonth, currentYear]);

  const handleAddExpense = async (expenseData) => {
    try {
      await expenseService.addExpense({
        ...expenseData,
        date: new Date(currentYear, currentMonth - 1, new Date().getDate())
      });
      fetchData(true);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Expense added!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add expense' });
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      fetchData(true);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Expense removed',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete expense' });
    }
  };

  const handleUpdateBudget = async (updateData) => {
    try {
      await budgetService.updateBudget({
        ...updateData,
        month: currentMonth,
        year: currentYear
      });
      fetchData(true);
      Swal.fire({ icon: 'success', title: 'Settings Updated', text: 'Your budget limits have been saved.', timer: 1500 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update budget' });
    }
  };

  const handleConfirmAlert = async () => {
    try {
      await budgetService.updateBudget({
        amount: budget.amount + 1000,
        month: currentMonth,
        year: currentYear
      });
      fetchData(true);
      Swal.fire({ icon: 'success', title: 'Top-up Successful', text: '₹1,000 has been added to your budget.', timer: 1500 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add balance' });
    }
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const savings = budget.amount - totalSpent;

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', gap: '1rem' }}>
      <RefreshCw className="spin" style={{ color: 'var(--primary)', height: '40px', width: '40px' }} />
      {slowLoading && (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-in' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Server is taking longer than usual to respond...</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>The server might be "waking up" (Cold Start). Please wait a few more seconds.</p>
        </div>
      )}
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1rem', color: '#ef4444', fontWeight: '500' }}>
        ⚠️ Connection Error
      </div>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
        We couldn't reach the server. Please check your internet or retry.
      </p>
      <button 
        onClick={fetchData}
        className="btn-primary"
        style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="container">
      <header className="header animate-slide-up">
        <div className="title-group">
          <div className="title-icon">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '1.25rem' }}>Budget Management</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Financial Overview</p>
          </div>
        </div>

        <div className="filter-bar">
          {isUpdating && <RefreshCw className="spin" size={14} style={{ marginRight: '8px', color: 'var(--primary)' }} />}
          <Calendar size={18} color="var(--primary)" />
          <select 
            className="filter-select" 
            value={currentMonth} 
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
          >
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select 
            className="filter-select" 
            value={currentYear} 
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <BudgetSummary 
          totalBudget={budget.amount} 
          spent={totalSpent} 
          savings={savings} 
          threshold={budget.threshold}
          onConfirmAlert={handleConfirmAlert}
        />
        
        <ExpenseForm 
          onAdd={handleAddExpense} 
          onBudgetUpdate={handleUpdateBudget} 
          currentBudget={budget} 
          totalSpent={totalSpent}
        />

        <div className="grid">
          <RecentExpenses 
            expenses={expenses} 
            onDelete={handleDeleteExpense} 
          />
          <CategoryChart data={stats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
