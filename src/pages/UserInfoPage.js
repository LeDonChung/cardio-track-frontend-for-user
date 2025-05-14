import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { CreatePostPage } from "./CreatePostPage";
import UpdateUserModal from "./UpdateUserModal";
import AddressModal from "./AddressModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyListPost,
  fetchComments,
  fetchDeletePost,
} from "../redux/slice/PostSlice";
import {
  fetchUserInfo,
  fetchUserAddresses,
  updateUserInfo,
  addAddress,
  updateAddress,
  deleteAddress,
  fetchUserOrders,
} from "../redux/slice/UserSlice";
import showToast from "../utils/AppUtils";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { format } from "date-fns";
import UpdatePostPage from "./UpdatePostPage";

export const UserInfoPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.myPosts) || [];
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadingMyPost, setLoadingMyPost] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle

  useEffect(() => {
    dispatch(fetchMyListPost())
      .then(() => setLoadingMyPost(false))
      .catch(() => setLoadingMyPost(false));
  }, [dispatch]);

  // Initialize userInfo from localStorage or null
  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    dispatch(fetchUserInfo()).then((res) => {
      if (res.payload) {
        setUserInfo(res.payload.data);
        localStorage.setItem("userInfo", JSON.stringify(res.payload.data));
      }
    });
  }, [dispatch]);

  // Initialize userAddresses from localStorage or empty array
  const [userAddresses, setUserAddresses] = useState(() => {
    const storedAddresses = localStorage.getItem("userAddress");
    return storedAddresses ? JSON.parse(storedAddresses) : [];
  });

  useEffect(() => {
    dispatch(fetchUserAddresses()).then((res) => {
      if (res.payload) {
        setUserAddresses(res.payload.data);
        localStorage.setItem("userAddress", JSON.stringify(res.payload.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      setIsLoading(true);
    }
  }, [navigate]);

  const handlerActionLogout = () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    const socket = new SockJS(`${process.env.REACT_APP_API_URL}/chat/api/v1/chat/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.publish({
          destination: "/app/user-disconnected",
          body: JSON.stringify({
            sender: { id: userInfo.id, username: userInfo.fullName },
          }),
        });
        client.deactivate();
        localStorage.removeItem("token");
        localStorage.removeItem("MyOrder");
        localStorage.removeItem("userInfo");
        navigate("/login");
      },
      onStompError: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        navigate("/login");
      },
    });
    client.activate();
  };

  const [isModalOpenUpdateUser, setIsModalOpenUpdateUser] = useState(false);

  const handleOpenModalUpdateUser = () => setIsModalOpenUpdateUser(true);
  const handleCloseModalUpdateUser = () => setIsModalOpenUpdateUser(false);

  const handleSaveUserInfo = (updatedUserInfo) => {
    dispatch(updateUserInfo(updatedUserInfo)).then(() => {
      showToast("Cập nhật thông tin thành công!", "success");
      dispatch(fetchUserInfo()).then((res) => {
        if (res.payload) {
          setUserInfo(res.payload.data);
          localStorage.setItem("userInfo", JSON.stringify(res.payload.data));
          setIsModalOpenUpdateUser(false);
        }
      });
    });
  };

  const [activeSection, setActiveSection] = useState("info"); // Default to "info"
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const isUser = userInfo?.roleNames?.includes("user");

  const handleCreatePost = () => {
    if (isUser) {
      showToast("Bạn không có quyền tạo bài viết", "error");
      return;
    }
    setIsModalOpen(true);
  };

  const handleUpdatePost = (post) => {
    setSelectedPost(post);
    setIsModalOpenUpdate(true);
  };

  const [addressToEdit, setAddressToEdit] = useState(null);

  const handleAddAddress = () => {
    setAddressToEdit(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setAddressToEdit(address);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (newAddress) => {
    if (addressToEdit) {
      newAddress.id = addressToEdit.id;
      dispatch(updateAddress(newAddress)).then(() => {
        setUserAddresses((prev) =>
          prev.map((address) =>
            address.id === addressToEdit.id ? { ...address, ...newAddress } : address
          )
        );
      });
    } else {
      dispatch(addAddress(newAddress)).then((res) => {
        const addedAddress = res.payload.data;
        setUserAddresses((prev) => [...prev, addedAddress]);
      });
    }
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (address) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      dispatch(deleteAddress(address)).then(() => {
        setUserAddresses((prev) => prev.filter((addr) => addr.id !== address.id));
      });
    }
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      setLoadingMyPost(true);
      dispatch(fetchDeletePost(postId))
        .then(() => dispatch(fetchMyListPost()))
        .catch((error) => console.error("Xóa bài viết thất bại:", error))
        .finally(() => setLoadingMyPost(false));
    }
  };

  const orders = JSON.parse(localStorage.getItem("MyOrder")) || [];

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, userInfo]);

  const filteredOrders = orders.filter(
    (order) =>
      (order.id && order.id.toString().includes(searchTerm)) ||
      order.item?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigation = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const comments = useSelector((state) => state.post.comments);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const openCommentModal = (post) => {
    dispatch(fetchComments(post.id));
    setIsCommentModalOpen(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      {isLoading && (
        <div className="container mx-auto mt-4 sm:mt-8 px-4 sm:px-6 lg:px-8">
          {/* Mobile Sidebar Toggle Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Menu</h2>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-blue-500 text-2xl"
            >
              <i className={isSidebarOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Sidebar */}
            <div
              className={`w-full lg:w-1/4 bg-white p-4 sm:p-6 rounded-lg shadow ${
                isSidebarOpen ? "block" : "hidden lg:block"
              }`}
            >
              <ul className="space-y-4 sm:space-y-6 text-base sm:text-xl font-bold">
                {[
                  { id: "info", label: "Thông tin cá nhân", icon: "fas fa-user" },
                  { id: "orders", label: "Đơn thuốc của tôi", icon: "fas fa-box" },
                  { id: "address", label: "Quản lý địa chỉ", icon: "fas fa-map-marker-alt" },
                  { id: "create-post", label: "Tạo bài viết", icon: "fas fa-pencil-alt", action: handleCreatePost },
                  { id: "my-post", label: "Bài viết của tôi", icon: "fas fa-file-alt" },
                  { id: "view-post", label: "Xem tin tức", icon: "fas fa-newspaper" },
                  { id: "logout", label: "Đăng xuất", icon: "fas fa-sign-out-alt", action: handlerActionLogout, color: "text-red-500" },
                ].map((item) => (
                  <li
                    key={item.id}
                    className={`cursor-pointer flex items-center ${
                      activeSection === item.id
                        ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                        : `hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4 ${item.color || ""}`
                    }`}
                    onClick={() => (item.action ? item.action() : handleNavigation(item.id))}
                  >
                    <i className={`${item.icon} mr-2 sm:mr-3`}></i>
                    <span className="text-sm sm:text-base">{item.label}</span>
                    <i className="fas fa-chevron-right ml-auto"></i>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Content */}
            <div className="w-full lg:flex-1 bg-white p-4 sm:p-6 rounded-lg shadow">
              {activeSection === "info" && (
                <div>
                  <div className="flex items-center justify-center border-b pb-4 mb-4">
                    <img
                      src="./UserInfo/userinfo.png"
                      alt="Avatar"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gray-300"
                    />
                  </div>
                  {userInfo ? (
                    <div className="space-y-4 w-full sm:w-3/4 mx-auto">
                      {[
                        { label: "Họ và tên", value: userInfo.fullName },
                        { label: "Số điện thoại", value: userInfo.username },
                        { label: "Giới tính", value: userInfo.gender },
                        { label: "Ngày sinh", value: userInfo.dob },
                      ].map((field, index) => (
                        <div key={index} className="flex justify-between border-b pb-2 text-sm sm:text-base">
                          <span className="font-medium">{field.label}</span>
                          <span>{field.value || "Chưa có thông tin"}</span>
                        </div>
                      ))}
                      <button
                        onClick={handleOpenModalUpdateUser}
                        className="w-full px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm sm:text-base"
                      >
                        Chỉnh sửa thông tin
                      </button>
                    </div>
                  ) : (
                    <p className="text-center text-sm sm:text-base pt-4">
                      Đang tải thông tin người dùng...
                    </p>
                  )}
                </div>
              )}

              {/* Modal Update User Info */}
              <UpdateUserModal
                isOpen={isModalOpenUpdateUser}
                onClose={handleCloseModalUpdateUser}
                userInfo={userInfo}
                onSave={handleSaveUserInfo}
              />

              {activeSection === "orders" && (
                <div>
                  <div className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 bg-blue-500 text-white p-4 rounded-t-lg text-center">
                    <h3 className="text-lg sm:text-2xl font-bold">Đơn thuốc của tôi</h3>
                  </div>
                  <div className="flex gap-2 sm:gap-4 mb-4 items-center">
                    <input
                      type="text"
                      placeholder="Tìm theo mã đơn, tên sản phẩm..."
                      className="border p-2 sm:p-3 rounded-lg w-full text-sm sm:text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search text-gray-500 text-lg sm:text-xl"></i>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
                    {[
                      { label: "Tất cả", icon: "fas fa-box", active: true },
                      { label: "Đang giao", icon: "fas fa-truck" },
                      { label: "Đã giao", icon: "fas fa-check" },
                      { label: "Đã hủy", icon: "fas fa-trash-alt" },
                      { label: "Trả hàng", icon: "fas fa-undo" },
                    ].map((filter, index) => (
                      <button
                        key={index}
                        className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center text-sm sm:text-base ${
                          filter.active ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                      >
                        <i className={`${filter.icon} mr-1 sm:mr-2`}></i> {filter.label}
                      </button>
                    ))}
                  </div>
                  <div className="overflow-y-auto max-h-[500px]">
                    {filteredOrders.length > 0 ? (
                      filteredOrders
                        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                        .map((order) => (
                          <div key={order.id} className="border-b pb-4 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between mb-4 text-sm sm:text-base">
                              <span className="font-medium">
                                Đơn đặt ngày: {format(new Date(order.orderDate), "dd/MM/yyyy")}
                              </span>
                              <span className="text-gray-500">Mã đơn: {order.id}</span>
                            </div>
                            {order.orderDetails?.map((orderDetail, index) => (
                              <div
                                key={index}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4"
                              >
                                <img
                                  src={order.imageUrl || "/default-image.jpg"}
                                  alt="Product"
                                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                                />
                                <div className="flex flex-col flex-1">
                                  <div className="text-blue-600 font-medium text-sm sm:text-base">
                                    {order.nameProduct}
                                  </div>
                                  <div className="text-sm sm:text-base">
                                    Giá: {orderDetail.price?.toLocaleString()} VND
                                  </div>
                                  <div className="text-sm sm:text-base">
                                    {orderDetail.quantity} {order.init}
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full sm:w-auto">
                                  <span className="font-medium text-sm sm:text-base">
                                    Thành tiền:{" "}
                                    {(orderDetail.price * orderDetail.quantity || 0).toLocaleString()} VND
                                  </span>
                                  <button
                                    className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base mt-2 sm:mt-0"
                                    onClick={() => navigate(`/product/${order.productId}`)}
                                  >
                                    Mua lại
                                  </button>
                                </div>
                              </div>
                            ))}
                            <div className="text-gray-600 text-sm sm:text-base mt-2">
                              Địa chỉ nhận hàng: {order.addressDetail?.street}, {order.addressDetail?.ward},{" "}
                              {order.addressDetail?.district}, {order.addressDetail?.province}
                            </div>
                            <div className="text-gray-600 text-sm sm:text-base mt-2">
                              Trạng thái: <span className="font-semibold">{order.status}</span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-center text-gray-500 text-sm sm:text-base">
                        Bạn chưa có đơn hàng nào.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeSection === "my-post" && !isUser && (
                <div>
                  <div className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 bg-blue-500 text-white p-4 rounded-t-lg text-center">
                    <h3 className="text-lg sm:text-xl font-bold">Bài viết của tôi</h3>
                  </div>
                  {loadingMyPost ? (
                    <p className="text-center text-sm sm:text-base">Đang tải...</p>
                  ) : posts.length === 0 ? (
                    <p className="text-center text-sm sm:text-base">Không có bài viết nào.</p>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <div className="max-h-[500px] overflow-y-auto">
                        {posts.map((post) => (
                          <div
                            key={post.id}
                            className="border-b pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                          >
                            <div className="flex-1">
                              <h2 className="text-base sm:text-xl font-semibold text-left">
                                Tác giả: <span className="font-normal">{post.fullName}</span>
                              </h2>
                              <h2 className="text-base sm:text-xl font-semibold text-left">
                                Tiêu đề: <span className="font-normal">{post.title}</span>
                              </h2>
                              <div
                                className="ql-editor text-sm sm:text-base"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                              />
                              <div className="text-xs sm:text-sm text-gray-500 text-left">
                                Ngày tạo: {format(new Date(post.createdAt), "HH:mm dd/MM/yyyy")}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
                              <button
                                className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm sm:text-base"
                                onClick={() => handleUpdatePost(post)}
                              >
                                Cập nhật
                              </button>
                              <button
                                className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm sm:text-base"
                                onClick={() => openCommentModal(post)}
                              >
                                Xem bình luận
                              </button>
                              <button
                                className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                Xoá
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    className="mt-4 px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                    onClick={handleCreatePost}
                  >
                    Tạo bài viết mới
                  </button>
                </div>
              )}

              {isModalOpenUpdate && selectedPost && (
                <UpdatePostPage
                  setIsModalOpen={setIsModalOpenUpdate}
                  postToEdit={selectedPost}
                />
              )}

              {isCommentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 sm:p-6 rounded-lg w-full sm:w-1/2 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between">
                      <h4 className="font-semibold text-sm sm:text-base">Danh sách bình luận:</h4>
                      <button
                        onClick={() => setIsCommentModalOpen(false)}
                        className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
                      >
                        Thoát
                      </button>
                    </div>
                    <div className="mt-4 space-y-4">
                      {comments && comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment.id} className="p-3 border-b border-gray-200 text-sm sm:text-base">
                            <p>
                              <strong>{comment.fullName}</strong>: {comment.content}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm")}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm sm:text-base">Chưa có bình luận nào.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "address" && (
                <div className="flex flex-col justify-between h-full">
                  <div className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 bg-blue-500 text-white p-4 rounded-t-lg text-center">
                    <h3 className="text-lg sm:text-xl font-bold">Quản lý địa chỉ</h3>
                  </div>
                  {Array.isArray(userAddresses) && userAddresses.length > 0 ? (
                    userAddresses.map((address) => (
                      <div
                        key={address.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 p-2 sm:p-4"
                      >
                        <div>
                          <p className="font-bold text-base sm:text-lg">{address.fullName}</p>
                          <p className="text-sm sm:text-base">
                            {address.phoneNumber} | {address.street}, {address.ward},{" "}
                            {address.district}, {address.province}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
                          <button
                            className="text-blue-500 font-semibold text-sm sm:text-base"
                            onClick={() => handleEditAddress(address)}
                          >
                            Sửa
                          </button>
                          <button
                            className="text-red-500 font-semibold text-sm sm:text-base"
                            onClick={() => handleDeleteAddress(address)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm sm:text-base">Không có địa chỉ nào.</p>
                  )}
                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base"
                      onClick={handleAddAddress}
                    >
                      Thêm địa chỉ mới
                    </button>
                  </div>
                </div>
              )}

              <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                addressToEdit={addressToEdit}
                onSave={handleSaveAddress}
              />

              {activeSection === "qr" && (
                <div className="text-center">
                  <div className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 bg-blue-500 text-white p-4 rounded-t-lg">
                    <h3 className="text-lg sm:text-xl font-bold">Mã QR của tôi</h3>
                  </div>
                  <img
                    src="./UserInfo/QR.jpg"
                    alt="QR"
                    className="w-40 h-40 sm:w-60 sm:h-60 mx-auto mt-4"
                  />
                </div>
              )}

              {isModalOpen && <CreatePostPage setIsModalOpen={setIsModalOpen} />}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};