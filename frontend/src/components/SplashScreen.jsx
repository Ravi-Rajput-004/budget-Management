import React from 'react';

const SplashScreen = ({ isVisible }) => {
  return (
    <div className={`splash-container ${!isVisible ? 'hide-splash' : ''}`}>
      <div className="splash-logo">Budget Management</div>
      <div className="splash-welcome">Welcome to your financial freedom</div>
      <div className="splash-loader"></div>
    </div>
  );
};

export default SplashScreen;
