import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
const Layout = ({ children }) => {
  const location = useLocation();
  const isInternalRoute = location.pathname.startsWith('/admin') || 
                          location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/student/lms') || 
                          location.pathname.startsWith('/live');

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isInternalRoute && <Navbar />}
      
      <main className="main-content" style={{ flexGrow: 1 }}>
        {children}
      </main>

      {!isInternalRoute && <Footer />}
    </div>
  );
};

export default Layout;
