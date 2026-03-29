import React from 'react';
import { Trash2, ShoppingBag, Car, Zap, Play, Home, Package } from 'lucide-react';

const CategoryIcon = ({ category }) => {
  const iconProps = { size: 16, strokeWidth: 2.5 };
  switch (category) {
    case 'Food': return <ShoppingBag {...iconProps} />;
    case 'Transport': return <Car {...iconProps} />;
    case 'Utilities': return <Zap {...iconProps} />;
    case 'Entertainment': return <Play {...iconProps} />;
    case 'Housing': return <Home {...iconProps} />;
    default: return <Package {...iconProps} />;
  }
};

const RecentExpenses = ({ expenses, onDelete }) => {
  return (
    <div className="card animate-slide-up" style={{ animationDelay: '0.6s' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Transaction History</h3>
      <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {expenses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {expenses.map((expense) => (
              <div 
                key={expense._id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '1rem',
                  background: 'var(--surface-alt)',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    background: 'white', 
                    color: 'var(--primary)',
                    padding: '10px', 
                    borderRadius: '10px',
                    display: 'flex',
                    border: '1px solid var(--border)'
                  }}>
                    <CategoryIcon category={expense.category} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{expense.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {expense.category}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--danger)' }}>
                    -₹{expense.amount.toFixed(2)}
                  </span>
                  <button 
                    onClick={() => onDelete(expense._id)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--secondary)', 
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '6px',
                      display: 'flex',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = 'var(--danger)';
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'var(--secondary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No transactions found for the selected period.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentExpenses;
