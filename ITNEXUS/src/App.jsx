import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

// Lazy load secondary pages to optimize initial bundle size
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const Team = lazy(() => import('./pages/Team'));
const Contact = lazy(() => import('./pages/Contact'));
const BlogHub = lazy(() => import('./pages/BlogHub'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

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
    <div className="bg-white text-slate-800 font-sans antialiased selection:bg-brand-blue selection:text-white min-h-screen overflow-x-hidden">
      {!isAdminPath && <Navbar />}

      {/* Main Container defined by light borders on both sides (Stripe style) */}
      <div className={`${isAdminPath ? 'w-full' : 'max-w-[1200px] mx-auto border-x border-slate-200/60 bg-[#FAFAFC] shadow-[0_0_50px_rgba(0,0,0,0.01)]'} min-h-screen flex flex-col relative`}>
        <Suspense fallback={
          <div className="flex-grow flex items-center justify-center min-h-[50vh]">
            <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
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
        </Suspense>
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