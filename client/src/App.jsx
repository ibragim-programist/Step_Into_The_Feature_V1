import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/Home/Home';
import LogIn from './components/LogIn/LogIn';
import Settings from './components/Settings/Settings';
import Profile from './components/Profile/Profile';
import Register from './components/Register/Register';
import Nav from './components/Nav/Nav';
import Error from './components/Error/Error';
import Room from './components/Room/Room';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Nav isLoggedIn={isLoggedIn} user={user} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home user={user} />
          </ProtectedRoute>
        } />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LogIn setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings user={user} />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile user={user} />
          </ProtectedRoute>
        } />
        <Route path="/room" element={
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;