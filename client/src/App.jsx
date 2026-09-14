import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingJagoWidget from './components/chat/FloatingJagoWidget';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Apply from './pages/Apply';
import Documents from './pages/Documents';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-1 w-full"
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* Fallback to Home */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-slate-100 selection:bg-brand-crimson selection:text-white">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#161926',
            color: '#f8fafc',
            border: '1px solid #2a2f47',
            borderRadius: '14px',
            fontSize: '13px',
            fontFamily: 'Outfit, sans-serif'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#161926',
            },
          },
          error: {
            iconTheme: {
              primary: '#e94560',
              secondary: '#161926',
            },
          }
        }}
      />

      <Navbar />
      
      <main className="flex-1 flex flex-col">
        <AnimatedRoutes />
      </main>

      <Footer />

      {/* Floating JAGO AI Assistant Widget */}
      <FloatingJagoWidget />
    </div>
  );
}

export default App;
