import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../utils/AppUtils";
import { register, sendOtp } from "../redux/slice/UserSlice";

export const RegisterPage = () => {
    const [userRegister, setUserRegister] = useState({
        username: '0867713557',
        password: "ledonchung",
        fullName: "Le Don Chung",
        rePassword: "ledonchung",
        email: 'ledonchung12a2@gmail.com',
        otp: "",
    });
    const [isOtpLoading, setIsOtpLoading] = useState(false); // Loading state for OTP button
    const [otpSent, setOtpSent] = useState(false); // Track if OTP was sent
    const [otpTimer, setOtpTimer] = useState(60); // Timer for OTP validity (60 seconds)

    const error = useSelector(state => state.user.errorResponse);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Timer logic for OTP validity
    useEffect(() => {
        let timer;
        if (otpSent && otpTimer > 0) {
            timer = setInterval(() => {
                setOtpTimer(prev => prev - 1);
            }, 1000);
        } else if (otpTimer === 0) {
            setOtpSent(false); // Reset OTP sent state when timer expires
        }
        return () => clearInterval(timer); // Cleanup on unmount or timer change
    }, [otpSent, otpTimer]);

    const handlerActionSendOtp = async () => {
        const phone = userRegister.username;
        if (!phone) {
            showToast("Vui lòng nhập số điện thoại.", 'error');
            return;
        }

        setIsOtpLoading(true); // Start loading
        await dispatch(sendOtp(phone))
            .unwrap()
            .then((res) => {
                showToast("Gửi mã OTP thành công.", 'success');
                setOtpSent(true); // Mark OTP as sent
                setOtpTimer(60); // Reset timer to 60 seconds
            })
            .catch(err => showToast(err.error || "Gửi mã OTP không thành công.", 'error'))
            .finally(() => setIsOtpLoading(false)); // Stop loading
    };

    const handlerActionRegister = async (e) => {
        e.preventDefault();
        if (userRegister.password !== userRegister.rePassword) {
            showToast("Mật khẩu không trùng khớp.", 'error');
            return;
        }

        await dispatch(register(userRegister))
            .unwrap()
            .then((res) => {
                showToast("Đăng ký thành công.", 'success');
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            })
            .catch(err => {
                console.log(err)
                showToast(err.error || "Đăng ký không thành công.", 'error')
            });
    };

    return (
        <div className="bg-white text-gray-900">
            <Header />
            <main className="container mx-auto mt-16">
                <div className="max-w-md mx-auto bg-white p-8">
                    <h2 className="text-center text-xl font-bold mb-4 text-custom-size">Đăng ký</h2>
                    <form id="formRegister" onSubmit={(e) => handlerActionRegister(e)}>
                        <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div className="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_phone.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userRegister.username}
                                    onChange={(e) => setUserRegister({ ...userRegister, username: e.target.value })}
                                    type="text"
                                    id="phoneNumber"
                                    placeholder="Số điện thoại"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                            </div>
                        </div>
                        <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div className="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_user_register.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userRegister.fullName}
                                    onChange={(e) => setUserRegister({ ...userRegister, fullName: e.target.value })}
                                    type="text"
                                    id="fullName"
                                    placeholder="Họ và tên"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                            </div>
                        </div>
                        <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div className="flex-shrink-0 flex-1 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-500"
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
                                    onChange={(e) => setUserRegister({ ...userRegister, email: e.target.value })}
                                    type="text"
                                    id="email"
                                    placeholder="Email"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                            </div>
                        </div>
                        <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div className="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_lock.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userRegister.password}
                                    onChange={(e) => setUserRegister({ ...userRegister, password: e.target.value })}
                                    type="password"
                                    id="password"
                                    placeholder="Mật khẩu"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                            </div>
                        </div>
                        <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div className="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_lock.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userRegister.rePassword}
                                    onChange={(e) => setUserRegister({ ...userRegister, rePassword: e.target.value })}
                                    type="password"
                                    id="rePassword"
                                    placeholder="Nhập lại mật khẩu"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                            </div>
                        </div>
                        <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
                            <div className="flex-shrink-0 flex-1 flex items-center">
                                <img
                                    src="/icon/ic_otp.png"
                                    alt="Thera Care Logo"
                                    className="h-6 w-6"
                                />
                                <input
                                    value={userRegister.otp}
                                    onChange={(e) => setUserRegister({ ...userRegister, otp: e.target.value })}
                                    type="text"
                                    id="otp"
                                    size={6}
                                    placeholder="Nhập OTP"
                                    className="flex-1 w-full ml-2 py-1 focus:outline-none text-custom-size"
                                />
                                <button
                                    type="button"
                                    onClick={handlerActionSendOtp}
                                >
                                    {isOtpLoading ? (
                                        <svg
                                            className="animate-resize h-6 w-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                    ) : (
                                        <img
                                            src="/icon/ic_send.png"
                                            alt="Thera Care Logo"
                                            className="h-6 w-6 hover:cursor-pointer"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                        {otpSent && otpTimer > 0 && (
                            <p className="text-green-600 text-sm mb-4">
                                Mã OTP có hiệu lực trong {otpTimer}s
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-[#005AE0] text-white py-2 rounded-[0.5rem]"
                        >
                            Đăng ký
                        </button>
                    </form>
                    <div className="flex justify-between mt-4">
                        <Link to={'/login'}>
                            <a className="text-blue-600">Đăng nhập</a>
                        </Link>
                        <a href="#" className="text-blue-600">Quên mật khẩu</a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};