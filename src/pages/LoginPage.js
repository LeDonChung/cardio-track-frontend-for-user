import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchUserInfo } from "../redux/slice/UserSlice";
import showToast from "../utils/AppUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export const LoginPage = () => {
  const [userLogin, setUserLogin] = useState({
    username: "0867713557",
    password: "123456",
  });
  const [loading, setLoading] = useState(false);

  const error = useSelector((state) => state.user.errorResponse);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlerActionLogin = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!userLogin.username.trim() || !userLogin.password.trim()) {
      showToast("Please enter both phone number and password.", "error");
      return;
    }

    setLoading(true);
    try {
      await dispatch(login(userLogin)).unwrap();
      await dispatch(fetchUserInfo());
      navigate("/");
    } catch (error) {
      console.error("❌ Login error:", error);
      showToast(error.error || "Login failed. Please try again.", "error");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Header />
      {/* Main Content */}
      <main className="container mx-auto mt-16 py-8">
        <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <h2 className="text-center text-xl sm:text-2xl font-bold mb-6 text-gray-800">
            Đăng nhập với mật khẩu
          </h2>
          <form id="formLogin" onSubmit={handlerActionLogin}>
            <div className="flex items-center border-b border-gray-300 mb-4 py-2">
              <img
                src="/icon/ic_phone.png"
                alt="Phone Icon"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
              />
              <input
                value={userLogin.username}
                onChange={(e) =>
                  setUserLogin({ ...userLogin, username: e.target.value })
                }
                type="text"
                id="phoneNumber"
                placeholder="Số điện thoại"
                className="flex-1 py-2 text-sm sm:text-base focus:outline-none focus:ring-0 disabled:bg-gray-100"
                disabled={loading}
                aria-label="Phone number"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 mb-6 py-2">
              <img
                src="/icon/ic_lock.png"
                alt="Lock Icon"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
              />
              <input
                value={userLogin.password}
                onChange={(e) =>
                  setUserLogin({ ...userLogin, password: e.target.value })
                }
                type="password"
                id="password"
                placeholder="Mật khẩu"
                className="flex-1 py-2 text-sm sm:text-base focus:outline-none focus:ring-0 disabled:bg-gray-100"
                disabled={loading}
                aria-label="Password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-400"
              disabled={loading}
              aria-label={loading ? "Logging in" : "Log in"}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
          <div className="flex justify-between mt-4 text-sm sm:text-base">
            <Link to="/register" className="text-blue-600 hover:underline">
              Đăng ký
            </Link>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Quên mật khẩu
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};