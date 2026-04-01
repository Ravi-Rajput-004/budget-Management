import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login: authLogin, register: authRegister } = useAuth();

  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
    setError('');
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        });
        authLogin(response.data);
      } else {
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const response = await authService.register(formData);
        authRegister(response.data);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (mode) => {
    if ((mode === 'login' && isLogin) || (mode === 'signup' && !isLogin)) return;
    setIsLogin(mode === 'login');
    navigate(mode === 'login' ? '/login' : '/signup');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-dual-panel">

        <div className="auth-illustration-side">
          <div className="auth-image-container">
            <img src="/auth-image.png" alt="Budget Management" />
          </div>
          <h2>Smart Budgeting</h2>
          <p>Take control of your finances with our simple and powerful budget tracking tool.</p>
        </div>


        <div className="auth-form-side">
          <div className="auth-form-header">
            <h1>{isLogin ? 'Welcome Back' : 'Get Started'}</h1>
            <p>{isLogin ? 'Enter your details to manage your budget' : 'Create an account to start tracking'}</p>
          </div>

          <div className="auth-toggle-bar">
            <button 
              className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
              onClick={() => toggleMode('login')}
            >
              Login
            </button>
            <button 
              className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => toggleMode('signup')}
            >
              Signup
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className={`auth-name-field ${isLogin ? 'hidden' : ''}`}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="Enter your name"
                    autoComplete="name"
                  />
                  <User size={18} className="input-icon" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                  autoComplete="email"
                  spellCheck="false"
                />
                <Mail size={18} className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  spellCheck="false"
                />
                <Lock size={18} className="input-icon" />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary auth-btn-large" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
