import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Contact from './pages/Contact';
import BlogHub from './pages/BlogHub';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="bg-[#FAFAFC] text-slate-800 font-sans antialiased selection:bg-brand-blue selection:text-white min-h-screen overflow-x-hidden">
      {!isAdminPath && <Navbar />}

      {/* Main Container defined by light borders on both sides (Stripe style) */}
      <div className={`${isAdminPath ? 'w-full' : 'max-w-[1200px] mx-auto border-x border-slate-200/60 bg-white shadow-[0_0_50px_rgba(0,0,0,0.01)]'} min-h-screen flex flex-col relative`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<BlogHub />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        {!isAdminPath && <Footer />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout />
    </Router>
  );
}