import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NavProvider } from './contexts/NavContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { PublicProvider } from './contexts/PublicContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { EventsList } from './pages/EventsList';
import { NewsList } from './pages/NewsList';
import { NewsArticle } from './pages/NewsArticle';
import { DynamicPage } from './pages/DynamicPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Contact } from './pages/Contact';
import { EventArticle } from './pages/EventArticle';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFound } from './pages/NotFound';
import { Footer } from './components/Footer';

function AppRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLogin = location.pathname === '/login';

  // Full-screen routes (no Navbar)
  if (isDashboard || isLogin) {
    return (
      <Routes>
        <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsArticle />} />
        <Route path="/events/:id" element={<EventArticle />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/:slug" element={<DynamicPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <NavProvider>
        <AuthProvider>
          <DashboardProvider>
            <PublicProvider>
              <AppRoutes />
            </PublicProvider>
          </DashboardProvider>
        </AuthProvider>
      </NavProvider>
    </Router>
  );
}

export default App;
