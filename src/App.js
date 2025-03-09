import './App.css';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CartPage } from './pages/CartPage';
import { OrderPage } from './pages/OrderPage';
import { ToastContainer } from 'react-toastify';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { UserInfoPage } from './pages/UserInfoPage.js';
import { CreatePostPage } from './pages/CreatePostPage.js';
import { ViewPostPage } from './pages/ViewPostPage.js';
import {AddressModal} from './pages/AddressModal.js';
import{UpdateUserModal} from './pages/UpdateUserModal.js';
import { FilterProductPage } from './pages/FilterProductPage.js';
import ChatBox from './components/ChatBox.js';
function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ChatBox />
      <Routes>
        
        {/* Login Page */}
        <Route path='/login' element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />

        {/* Register Page */}
        <Route path='/register' element={<RegisterPage />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        {/* User info page */}
        <Route path="/user" element={<UserInfoPage />} />
        
        {/* Create Post Page */}
        <Route path="/create-post" element={<CreatePostPage />} />

        {/* Shopping */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderPage />} />

        {/* View Post Page */}
        <Route path="/view-post" element={<ViewPostPage />} />
        
        {/* product detail page */}
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* filter product page */}
        <Route path="/filter-product" element={<FilterProductPage />} />


      </Routes>
    </BrowserRouter>

  );
}

export default App;
