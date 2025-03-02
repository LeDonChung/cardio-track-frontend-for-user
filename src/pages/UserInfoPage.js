import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { CreatePostPage } from "./CreatePostPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, fetchUserAddresses } from "../redux/slice/UserSlice";

export const UserInfoPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userAddresses = useSelector((state) => state.user.userAddresses);

  // ✅ Lấy dữ liệu user từ localStorage khi load trang
  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    // return storedUser !== null  || storedUser !== undefined ? JSON.parse(storedUser) : null;
  });

  //userInfo đã dc get fullfill rồi chỉ cần gọi ra là đc
  useEffect(() => {
    dispatch(fetchUserInfo()).then((res) => {
      if (res.payload) {
        setUserInfo(res.payload.data);
        localStorage.setItem("userInfo", JSON.stringify(res.payload.data)); // Lưu lại nếu cần
      }
    });
  }, [dispatch]);

  useEffect(() => {
    // Gọi fetchUserAddresses với userId từ userInfo
    dispatch(fetchUserAddresses());
  }, [dispatch]);

  const [activeSection, setActiveSection] = useState("info");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePost = () => {
    setIsModalOpen(true);
  };

  const addressInfo = {
    name: "Mai Chiến Nở",
    phone: "0967439320",
    address: "2/13 hẻm 2 Bạch Đằng, Phường 2, Quận Tân Bình, Hồ Chí Minh",
  };

  const orders = [
    {
      id: "31749",
      date: "7:02 26/11/2024",
      item: "ATITUDE 250MG/5ML AN TIÊN 6X5 ỐNG 5ML",
      price: "15.000đ",
      quantity: "1 Vi",
      status: "Đã giao",
      address:
        "Nhận hàng tại: Nhà thuốc Long Châu 8B - 10B Nguyễn Thái Sơn, P.3, Q. Gò Vấp, TP.HCM",
      image:
        "https://tinhdoanvinhphuc.vn/wp-content/uploads/2020/04/thuoc-bo-pharmaton-co-tot-khong.jpg",
    },
    {
      id: "31750",
      date: "8:21 26/11/2024",
      item: "ATITUDE 250MG/5ML AN TIÊN 6X5 ỐNG 5ML",
      price: "3.000đ",
      quantity: "5 ống",
      status: "Đang giao",
      address:
        "Nhận hàng tại: Nhà thuốc Long Châu 159 Nguyễn Văn Nghi, P.6, Q. Bình Thạnh, TP. HCM",
      image:
        "https://tinhdoanvinhphuc.vn/wp-content/uploads/2020/04/thuoc-bo-pharmaton-co-tot-khong.jpg",
    },
  ];

  const handleNavigation = (section) => {
    setActiveSection(section);
  };

  const filteredOrders = orders.filter((order) => {
    return (
      order.id.includes(searchTerm) ||
      order.item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto mt-8 flex gap-6">
        <div className="w-1/4 bg-white p-6 rounded-lg shadow flex flex-col items-start justify-start">
          <ul className="space-y-6 text-xl font-bold w-full">
            <li
              className={`cursor-pointer ${
                activeSection === "info"
                  ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                  : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
              }`}
              onClick={() => handleNavigation("info")}
            >
              <i className="fas fa-user mr-3"></i> Thông tin cá nhân
              <i className="fas fa-chevron-right ml-2"></i>
            </li>
            <li
              className={`cursor-pointer ${
                activeSection === "qr"
                  ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                  : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
              }`}
              onClick={() => handleNavigation("qr")}
            >
              <i className="fas fa-qrcode mr-3"></i> Mã QR của tôi
              <i className="fas fa-chevron-right ml-2"></i>
            </li>
            <li
              className={`cursor-pointer ${
                activeSection === "orders"
                  ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                  : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
              }`}
              onClick={() => handleNavigation("orders")}
            >
              <i className="fas fa-box mr-3"></i> Đơn thuốc của tôi
              <i className="fas fa-chevron-right ml-2"></i>
            </li>
            <li
              className={`cursor-pointer ${
                activeSection === "address"
                  ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                  : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
              }`}
              onClick={() => handleNavigation("address")}
            >
              <i className="fas fa-map-marker-alt mr-3"></i> Quản lý địa chỉ
              <i className="fas fa-chevron-right ml-2"></i>
            </li>
            <li
              className={`cursor-pointer ${
                activeSection === "payment"
                  ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                  : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
              }`}
              onClick={() => handleNavigation("payment")}
            >
              <i className="fas fa-credit-card mr-3"></i> Quản lý thanh toán
              <i className="fas fa-chevron-right ml-2"></i>
            </li>
            <li
              className={`cursor-pointer ${
                activeSection === "create-post"
                  ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                  : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
              }`}
              onClick={handleCreatePost}
            >
              <i className="fas fa-pencil-alt mr-3"></i> Tạo bài viết
              <i className="fas fa-chevron-right ml-2"></i>
            </li>
            <li
              className={`cursor-pointer ${
                activeSection === "my-post"
                  ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                  : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
              }`}
              onClick={() => handleNavigation("my-post")}
            >
              <i className="fas fa-file-alt mr-3"></i> Bài viết của tôi
              <i className="fas fa-chevron-right ml-2"></i>
            </li>
            <li
              className={`cursor-pointer ${
                activeSection === "view-post"
                  ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                  : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
              }`}
              onClick={() => handleNavigation("view-post")}
            >
              <i className="fas fa-newspaper mr-3"></i> Xem tin tức
              <i className="fas fa-chevron-right ml-2"></i>
            </li>
            <li
              className={`cursor-pointer text-red-500 ${
                activeSection === "logout"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-500 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
              }`}
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              <i className="fas fa-sign-out-alt mr-3"></i> Đăng xuất
              <i className="fas fa-chevron-right ml-2"></i>
            </li>
          </ul>
        </div>

        <div className="flex-1 bg-white p-6 rounded-lg shadow">
          {activeSection === "info" && (
            <div className="flex items-center justify-center border-b pb-4 mb-4">
              <div className="flex items-center space-x-4 flex-col">
                <img
                  src="./UserInfo/userinfo.png"
                  alt="Avatar"
                  className="w-30 h-25 rounded-full border border-gray-300"
                />
                <div>
                  <p className="text-blue-600 font-semibold cursor-pointer mt-1">
                    Thay đổi ảnh đại diện
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 bg-white p-1 rounded-lg shadow">
            {activeSection === "info" ? 
            ( userInfo ? (
              <div className="space-y-4 w-3/4 mx-auto">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Họ và tên</span>
                  <span>{userInfo.fullName || "Chưa có thông tin"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Số điện thoại</span>
                  <span>{userInfo.username || "Chưa có thông tin"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Giới tính</span>
                  <span>
                    {userInfo.gender || (
                      <span className="text-blue-600 cursor-pointer">
                        Thêm thông tin
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Ngày sinh</span>
                  <span>
                    {userInfo.dob || (
                      <span className="text-blue-600 cursor-pointer">
                        Thêm thông tin
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ) : (
                <p style={{paddingTop:"20px",fontSize:"16px",textAlign:'center'}}>Đang tải thông tin người dùng...</p>
              )
            ) : null}
          </div>

          {activeSection === "info" && (
            <div className="mt-6 text-center">
              <button className="px-6 py-2 bg-gray-400 font-semibold text-white rounded-xl w-2/4 hover:bg-blue-500">
                Chỉnh sửa thông tin
              </button>
            </div>
          )}

          {activeSection === "orders" && (
            <div>
              <div className="-mx-6 -mt-6 bg-blue-500 text-white p-2 rounded-t-lg text-center">
                <h3 className="text-xl font-bold">Đơn thuốc của tôi</h3>
              </div>
              <div className="flex gap-4 mb-4 items-center">
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn, tên sản phẩm..."
                  className="border p-2 rounded-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search text-gray-500 ml-2"></i>
              </div>
              <div className="flex gap-4 mb-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center">
                  <i className="fas fa-box mr-2"></i> Tất cả
                </button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg flex items-center">
                  <i className="fas fa-truck mr-2"></i> Đang giao
                </button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg flex items-center">
                  <i className="fas fa-check mr-2"></i> Đã giao
                </button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg flex items-center">
                  <i className="fas fa-trash-alt mr-2"></i> Đã hủy
                </button>
                <button className="px-4 py-2 bg-gray-200 rounded-lg flex items-center">
                  <i className="fas fa-undo mr-2"></i> Trả hàng
                </button>
              </div>
              <div className="overflow-y-auto max-h-[400px]">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border-b pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{order.date}</span>
                      <span className="text-gray-500">Mã đơn: {order.id}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <img
                        src={order.image}
                        alt="Product"
                        className="w-20 h-20 object-cover"
                      />
                      <div className="text-blue-600">{order.item}</div>
                    </div>
                    <div className="text-gray-600">
                      Số lượng: {order.quantity}
                    </div>
                    <div className="text-gray-600">
                      Địa chỉ: {order.address}
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium">{order.price}</span>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Mua lại
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "qr" && (
            <div className="text-center">
              <div className="-mx-6 -mt-6 bg-blue-500 text-white p-2 rounded-t-lg">
                <h3 className="text-xl font-bold">Mã QR của tôi</h3>
              </div>
              <img
                src="./UserInfo/QR.jpg"
                alt="QR"
                className="w-65 h-60 mx-auto mt-4"
              />
            </div>
          )}

          {activeSection === "address" && (
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="-mx-6 -mt-6 bg-blue-500 text-white p-2 rounded-t-lg text-center">
                  <h3 className="text-xl font-bold">Quản lý địa chỉ</h3>
                </div>
                {userAddresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex items-center justify-between mb-4"
                  >
                    <div style={{ margin: "10px" }}>
                      <p style={{ fontWeight: "bold", fontSize: 22 }}>
                        {address.fullName}
                      </p>
                      <p style={{ fontSize: 17 }}>
                        {address.phoneNumber} | {address.street}, {address.ward}
                        , {address.district}, {address.province}
                      </p>
                    </div>
                    <button
                      className="text-blue-500 font-semibold"
                      style={{ fontSize: 20 }}
                    >
                      Sửa
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-auto mb-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Thêm địa chỉ mới
                </button>
              </div>
            </div>
          )}

          {activeSection === "payment" && (
            <div className="text-center flex flex-col justify-between h-full">
              <div className="-mx-6 -mt-6 bg-blue-500 text-white p-2 rounded-t-lg text-center">
                <h3 className="text-xl font-bold">Quản lý thanh toán</h3>
              </div>
              <div className="flex justify-center mt-auto mb-4">
                <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg">
                  Cập nhật thông tin thanh toán
                </button>
              </div>
            </div>
          )}

          {isModalOpen && <CreatePostPage setIsModalOpen={setIsModalOpen} />}
        </div>
      </div>
      <Footer />
    </div>
  );
};
