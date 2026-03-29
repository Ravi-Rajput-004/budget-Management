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

  const fetchData = async () => {
    try {
      const [budgetRes, expensesRes, statsRes] = await Promise.all([
        budgetService.getBudget(currentMonth, currentYear),
        expenseService.getExpenses(currentMonth, currentYear),
        expenseService.getStats(currentMonth, currentYear)
      ]);
      setBudget(budgetRes.data);
      setExpenses(expensesRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth, currentYear]);

  const handleAddExpense = async (expenseData) => {
    try {
      await expenseService.addExpense({
        ...expenseData,
        date: new Date(currentYear, currentMonth - 1, new Date().getDate())
      });
      fetchData();
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
      fetchData();
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
      fetchData();
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
      fetchData();
      Swal.fire({ icon: 'success', title: 'Top-up Successful', text: '₹1,000 has been added to your budget.', timer: 1500 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add balance' });
    }
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const savings = budget.amount - totalSpent;

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <RefreshCw className="spin" style={{ color: 'var(--primary)', height: '40px', width: '40px' }} />
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
