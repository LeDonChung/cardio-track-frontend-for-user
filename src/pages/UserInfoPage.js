import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';


export const UserInfoPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("info"); // State to track the active section

    // Dữ liệu giả lập (không lấy từ backend)
    const userInfo = {
        fullName: "Nguyễn Văn A",
        username: "0123456789",
        gender: "Nam",
        dob: "01-01-1990",
    };

    const orders = [
        {
            id: "31749",
            date: "7:02 26/11/2024",
            item: "ATITUDE 250MG/5ML AN TIÊN 6X5 ỐNG 5ML",
            price: "15.000đ",
            quantity: "1 Vi",
            status: "Đã giao",
            address: "Nhận hàng tại: Nhà thuốc Long Châu 8B - 10B Nguyễn Thái Sơn, P.3, Q. Gò Vấp, TP.HCM"
        },
        {
            id: "31750",
            date: "8:21 26/11/2024",
            item: "ATITUDE 250MG/5ML AN TIÊN 6X5 ỐNG 5ML",
            price: "3.000đ",
            quantity: "5 ống",
            status: "Đã giao",
            address: "Nhận hàng tại: Nhà thuốc Long Châu 159 Nguyễn Văn Nghi, P.6, Q. Bình Thạnh, TP. HCM"
        }
    ];

    const handleNavigation = (section) => {
        setActiveSection(section); // Update the active section
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="container mx-auto mt-8 flex gap-6">
                {/* Sidebar */}
                <div className="w-1/4 bg-white p-6 rounded-lg shadow flex flex-col items-start justify-start">
                    <ul className="space-y-6 text-xl font-bold w-full">
                        <li
                            className={`cursor-pointer ${activeSection === "info" ? "bg-blue-400 text-white rounded-lg py-2 px-4" : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"}`}
                            onClick={() => handleNavigation("info")}
                        >
                            <i className="fas fa-user mr-3"></i> Thông tin cá nhân
                            <i className="fas fa-chevron-right ml-2"></i>
                        </li>
                        <li
                            className={`cursor-pointer ${activeSection === "qr" ? "bg-blue-400 text-white rounded-lg py-2 px-4" : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"}`}
                            onClick={() => handleNavigation("qr")}
                        >
                            <i className="fas fa-qrcode mr-3"></i> Mã QR của tôi
                            <i className="fas fa-chevron-right ml-2"></i>
                        </li>
                        <li
                            className={`cursor-pointer ${activeSection === "orders" ? "bg-blue-400 text-white rounded-lg py-2 px-4" : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"}`}
                            onClick={() => handleNavigation("orders")}
                        >
                            <i className="fas fa-box mr-3"></i> Đơn thuốc của tôi
                            <i className="fas fa-chevron-right ml-2"></i>
                        </li>
                        <li
                            className={`cursor-pointer ${activeSection === "address" ? "bg-blue-400 text-white rounded-lg py-2 px-4" : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"}`}
                            onClick={() => handleNavigation("address")}
                        >
                            <i className="fas fa-map-marker-alt mr-3"></i> Quản lý địa chỉ
                            <i className="fas fa-chevron-right ml-2"></i>
                        </li>
                        <li
                            className={`cursor-pointer ${activeSection === "payment" ? "bg-blue-400 text-white rounded-lg py-2 px-4" : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"}`}
                            onClick={() => handleNavigation("payment")}
                        >
                            <i className="fas fa-credit-card mr-3"></i> Quản lý thanh toán
                            <i className="fas fa-chevron-right ml-2"></i>
                        </li>
                        <li
                            className={`cursor-pointer text-red-500 ${activeSection === "logout" ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"}`}
                                onClick={() => {localStorage.removeItem('token'); navigate('/login'); // Chuyển hướng đến trang login khi đăng xuất
                }}>
                        <i className="fas fa-sign-out-alt mr-3"></i> Đăng xuất
                        <i className="fas fa-chevron-right ml-2"></i>
                        </li>
                    </ul>
                </div>

                {/* Main Content - thông tin người dùng - hình avatar */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-center border-b pb-4 mb-4">
                        <div className="flex items-center space-x-4 flex-col">
                            <img
                                src="./UserInfo/userinfo.png"
                                alt="Avatar"
                                className="w-30 h-25 rounded-full border border-gray-300"
                            />
                            <div>
                                <p className="text-blue-600 font-semibold cursor-pointer mt-1">Thay đổi ảnh đại diện</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Personal Information nội dung */}
                    <div className="space-y-4 w-3/4 mx-auto">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Họ và tên</span>
                            <span>{userInfo.fullName}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Số điện thoại</span>
                            <span>{userInfo.username}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Giới tính</span>
                            <span>{userInfo.gender || <span className="text-blue-600 cursor-pointer">Thêm thông tin</span>}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Ngày sinh</span>
                            <span>{userInfo.dob || <span className="text-blue-600 cursor-pointer">Thêm thông tin</span>}</span>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button className="px-6 py-2 bg-gray-400 font-semibold text-white rounded-xl w-2/4 hover:bg-blue-500">
                            Chỉnh sửa thông tin
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};