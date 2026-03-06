import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PasswordGate from './components/PasswordGate';
import Home from './pages/Home';
import ValentinePage from './pages/ValentinePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mg_token');
    if (token) setIsAuthenticated(true);
    setLoading(false);
  }, []);

  if (loading) return null;

  const handleLock = () => {
    localStorage.removeItem('mg_token');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <PasswordGate key="gate" onUnlock={() => setIsAuthenticated(true)} />
          ) : (
            <Routes>
              <Route path="/" element={<Home key="home" onLock={handleLock} />} />
              <Route path="/valentine" element={<ValentinePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;
