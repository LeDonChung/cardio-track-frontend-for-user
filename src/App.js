import './App.css';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CartPage } from './pages/CartPage';
import { OrderPage } from './pages/OrderPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { UserInfoPage } from './pages/UserInfoPage.js';
import { CreatePostPage } from './pages/CreatePostPage.js';
import { ViewPostPage } from './pages/ViewPostPage.js';
import { NewsPage } from './pages/NewsPage.js';
import { FilterProductPage } from './pages/FilterProductPage.js';
import ChatBox from './components/ChatBox.js';
import { PaymentResult } from './components/PaymentResult.js';
import ConsultBox from './components/ConsultBox.js';
import { HealthCheckDetail } from './pages/HealthCheckDetail.js';
import { PostDetailPage } from './pages/PostDetailPage.js';
import { HealthCheck } from './pages/HealthCheck.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserInfo } from './redux/slice/UserSlice.js';
function App() {

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className='fixed bottom-4 right-4 z-50'>
        <ChatBox />
        <ConsultBox />
      </div>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />

        {/* Register Page */}
        <Route path="/register" element={<RegisterPage />} />
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
        {/* View Detail Post Page theo title */}
        <Route path="/search/:title" element={<PostDetailPage />} />
        {/* News */}
        <Route path="/news" element={<NewsPage />} />

        {/* Health Check */}
        <Route path="/health-check" element={<HealthCheck />} />
        <Route path="/health-check/:id" element={<HealthCheckDetail />} />

        {/* product detail page */}
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* filter product page */}
        <Route path="/filter-product" element={<FilterProductPage />} />

        {/* payment result*/}
        <Route path="/payment-result" element={<PaymentResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
