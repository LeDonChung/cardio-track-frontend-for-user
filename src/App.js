import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        // Login Page
        <Route path='/login' element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />

        // Register Page
        <Route path='/register' element={<RegisterPage />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;
