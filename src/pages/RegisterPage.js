import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../utils/AppUtils";
import { register, sendOtp } from "../redux/slice/UserSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export const RegisterPage = () => {
  const [userRegister, setUserRegister] = useState({
    username: "0867713557",
    password: "ledonchung",
    fullName: "Le Don Chung",
    rePassword: "ledonchung",
    email: "ledonchung12a2@gmail.com",
    otp: "",
  });
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false); // Loading state for registration
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  const error = useSelector((state) => state.user.errorResponse);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // OTP timer logic
  useEffect(() => {
    let timer;
    if (otpSent && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setOtpSent(false);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpTimer]);

  // Validate inputs
  const validateInputs = () => {
    const { username, fullName, email, password, rePassword, otp } = userRegister;
    if (!username.trim()) {
      showToast("Vui lòng nhập số điện thoại.", "error");
      return false;
    }
    if (!fullName.trim()) {
      showToast("Vui lòng nhập họ và tên.", "error");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Vui lòng nhập email hợp lệ.", "error");
      return false;
    }
    if (password.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự.", "error");
      return false;
    }
    if (password !== rePassword) {
      showToast("Mật khẩu không trùng khớp.", "error");
      return false;
    }
    if (!otp.trim() || otp.length !== 6) {
      showToast("Vui lòng nhập mã OTP hợp lệ (6 chữ số).", "error");
      return false;
    }
    return true;
  };

  const handlerActionSendOtp = async () => {
    const phone = userRegister.username;
    if (!phone.trim()) {
      showToast("Vui lòng nhập số điện thoại.", "error");
      return;
    }

    setIsOtpLoading(true);
    try {
      await dispatch(sendOtp(phone)).unwrap();
      showToast("Gửi mã OTP thành công.", "success");
      setOtpSent(true);
      setOtpTimer(60);
    } catch (err) {
      showToast(err.error || "Gửi mã OTP không thành công.", "error");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handlerActionRegister = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsRegisterLoading(true);
    try {
      await dispatch(register(userRegister)).unwrap();
      showToast("Đăng ký thành công.", "success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Register error:", err);
      showToast(err.error || "Đăng ký không thành công.", "error");
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto mt-16 py-8">
        <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <h2 className="text-center text-xl sm:text-2xl font-bold mb-6 text-gray-800">
            Đăng ký
          </h2>
          <form id="formRegister" onSubmit={handlerActionRegister}>
            <div className="flex items-center border-b border-gray-300 mb-4 py-2">
              <img
                src="/icon/ic_phone.png"
                alt="Phone Icon"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
              />
              <input
                value={userRegister.username}
                onChange={(e) =>
                  setUserRegister({ ...userRegister, username: e.target.value })
                }
                type="text"
                id="phoneNumber"
                placeholder="Số điện thoại"
                className="flex-1 py-2 text-sm sm:text-base focus:outline-none disabled:bg-gray-100"
                disabled={isRegisterLoading}
                aria-label="Phone number"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 mb-4 py-2">
              <img
                src="/icon/ic_user_register.png"
                alt="User Icon"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
              />
              <input
                value={userRegister.fullName}
                onChange={(e) =>
                  setUserRegister({ ...userRegister, fullName: e.target.value })
                }
                type="text"
                id="fullName"
                placeholder="Họ và tên"
                className="flex-1 py-2 text-sm sm:text-base focus:outline-none disabled:bg-gray-100"
                disabled={isRegisterLoading}
                aria-label="Full name"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 mb-4 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                value={userRegister.email}
                onChange={(e) =>
                  setUserRegister({ ...userRegister, email: e.target.value })
                }
                type="email"
                id="email"
                placeholder="Email"
                className="flex-1 py-2 text-sm sm:text-base focus:outline-none disabled:bg-gray-100"
                disabled={isRegisterLoading}
                aria-label="Email"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 mb-4 py-2">
              <img
                src="/icon/ic_lock.png"
                alt="Lock Icon"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
              />
              <input
                value={userRegister.password}
                onChange={(e) =>
                  setUserRegister({ ...userRegister, password: e.target.value })
                }
                type="password"
                id="password"
                placeholder="Mật khẩu"
                className="flex-1 py-2 text-sm sm:text-base focus:outline-none disabled:bg-gray-100"
                disabled={isRegisterLoading}
                aria-label="Password"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 mb-4 py-2">
              <img
                src="/icon/ic_lock.png"
                alt="Lock Icon"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
              />
              <input
                value={userRegister.rePassword}
                onChange={(e) =>
                  setUserRegister({ ...userRegister, rePassword: e.target.value })
                }
                type="password"
                id="rePassword"
                placeholder="Nhập lại mật khẩu"
                className="flex-1 py-2 text-sm sm:text-base focus:outline-none disabled:bg-gray-100"
                disabled={isRegisterLoading}
                aria-label="Confirm password"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 mb-4 py-2">
              <img
                src="/icon/ic_otp.png"
                alt="OTP Icon"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
              />
              <input
                value={userRegister.otp}
                onChange={(e) =>
                  setUserRegister({ ...userRegister, otp: e.target.value })
                }
                type="text"
                id="otp"
                maxLength="6"
                placeholder="Nhập OTP"
                className="flex-1 py-2 text-sm sm:text-base focus:outline-none disabled:bg-gray-100"
                disabled={isRegisterLoading}
                aria-label="OTP code"
              />
              <button
                type="button"
                onClick={handlerActionSendOtp}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={isOtpLoading || otpSent}
                aria-label="Send OTP"
                aria-busy={isOtpLoading}
              >
                {isOtpLoading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin h-5 w-5 text-gray-600"
                  />
                ) : (
                  <img
                    src="/icon/ic_send.png"
                    alt="Send OTP"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                )}
              </button>
            </div>
            {otpSent && otpTimer > 0 && (
              <p className="text-green-600 text-sm mb-4">
                Mã OTP có hiệu lực trong {otpTimer}s
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-400"
              disabled={isRegisterLoading}
              aria-label={isRegisterLoading ? "Registering" : "Register"}
              aria-busy={isRegisterLoading}
            >
              {isRegisterLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký"
              )}
            </button>
          </form>
          <div className="flex justify-between mt-4 text-sm sm:text-base">
            <Link to="/login" className="text-blue-600 hover:underline">
              Đăng nhập
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