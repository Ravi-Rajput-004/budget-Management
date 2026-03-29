import React from 'react';
import { DollarSign, Wallet, TrendingDown, AlertCircle } from 'lucide-react';

const BudgetSummary = ({ totalBudget, spent, savings, threshold, onConfirmAlert }) => {
  const remaining = totalBudget - spent;
  const isLowBalance = remaining <= threshold && remaining > 0;
  const isOverBudget = spent > totalBudget && totalBudget > 0;

  return (
    <div>
      {(isLowBalance || isOverBudget) && (
        <div className={`alert-banner animate-slide-up ${isOverBudget ? 'over-budget' : ''}`} 
             style={{ background: isOverBudget ? '#fef2f2' : '#fffbeb', borderColor: isOverBudget ? '#fee2e2' : '#fef3c7', color: isOverBudget ? '#991b1b' : '#92400e', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={18} />
            <span>
              {isOverBudget 
                ? "CRITICAL: You have exceeded your monthly budget allocation." 
                : `LOW FUNDS: Your remaining balance has fallen below your ₹${threshold.toLocaleString()} threshold.`}
            </span>
          </div>
          {!isOverBudget && (
            <button 
              onClick={onConfirmAlert}
              style={{
                background: '#92400e',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              OK - Add ₹1,000
            </button>
          )}
        </div>
      )}

      <div className="grid">
        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: '#f0f9ff', color: '#0369a1', padding: '12px', borderRadius: '12px' }}>
              <Wallet size={20} />
            </div>
            <div>
              <p className="label" style={{ marginBottom: 0 }}>Total Budget</p>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{totalBudget.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '12px' }}>
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="label" style={{ marginBottom: 0 }}>Total Spent</p>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: isOverBudget ? 'var(--danger)' : 'inherit' }}>
                ₹{spent.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: '#f0fdf4', color: '#15803d', padding: '12px', borderRadius: '12px' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <p className="label" style={{ marginBottom: 0 }}>Monthly Savings</p>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: savings >= 0 ? '#166534' : 'var(--danger)' }}>
                ₹{savings.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;
