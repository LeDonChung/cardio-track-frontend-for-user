import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import { HomePage } from './pages/HomePage';
import {UserInfoPage} from './pages/UserInfoPage.js';  
import {CreatePostPage} from './pages/CreatePostPage.js';
import { ViewPostPage } from './pages/ViewPostPage.js';
function App() {
  return (
    <BrowserRouter>
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
        
        
          {/* View Post Page */}
        <Route path="/view-post" element={<ViewPostPage />} />


        

        
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
