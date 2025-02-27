import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CartPage } from './pages/CartPage';
import { OrderPage } from './pages/OrderPage';
import { ToastContainer } from 'react-toastify';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        // Login Page
        <Route path='/login' element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />

        // Register Page
        <Route path='/register' element={<RegisterPage />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        
        {/* Shopping */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderPage />} />

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
