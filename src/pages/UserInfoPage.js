import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { CreatePostPage } from "./CreatePostPage";
import UpdateUserModal from "./UpdateUserModal";
import AddressModal from "./AddressModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyListPost } from "../redux/slice/PostSlice";
import { fetchUserInfo, fetchUserAddresses, updateUserInfo, addAddress, updateAddress, deleteAddress, fetchUserOrders } from "../redux/slice/UserSlice";
import showToast from "../utils/AppUtils";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { format } from "date-fns";
import UpdatePostPage from "./UpdatePostPage"; 

export const UserInfoPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userAddresses = useSelector((state) => state.user.userAddresses);
  const posts = useSelector((state) => state.post.myPosts) || []; // Lấy bài viết từ redux store và đảm bảo nó là một mảng
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadingMyPost, setLoadingMyPost] = useState(true); 
  useEffect(() => {
    // Gọi API lấy bài viết của người dùng
    dispatch(fetchMyListPost())
      .then(() => {
        setLoadingMyPost(false);
      })
      .catch(() => {
        setLoadingMyPost(false);
      });
  }, [dispatch]);



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

  useEffect(() => {
    // kiểm tra đã login chưa
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      setIsLoading(true);
    }
  }, []);

  // Hàm xử lý logout và gửi thông tin qua socket
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const handlerActionLogout = () => {
          if (!user) {
              // Nếu không có user (đề phòng), chỉ cần navigate về login
              navigate('/login');
              return;
          }
      
          const socket = new SockJS("http://localhost:8888/api/v1/chat/ws");
          const client = new Client({
              webSocketFactory: () => socket,
              onConnect: () => {
                  console.log("📤 Gửi thông tin đăng xuất qua socket");
      
                  client.publish({
                      destination: "/app/user-disconnected",
                      body: JSON.stringify({
                          sender: {
                              id: user.id,
                              username: user.fullName
                          }
                      })
                  });
      
                  client.deactivate(); // Ngắt kết nối sau khi gửi xong
      
                  // Sau khi gửi socket thành công, xóa dữ liệu và navigate
                  localStorage.removeItem('token');
                  localStorage.removeItem('userInfo');
                  navigate('/login');
              },
              onStompError: (frame) => {
                  console.error('STOMP error', frame);
      
                  // Trường hợp socket lỗi vẫn đảm bảo logout
                  localStorage.removeItem('token');
                  localStorage.removeItem('userInfo');
                  navigate('/login');
              }
          });
      
          client.activate();
      }

  //hàm cập nhật user theo id
  const [isEditing, setIsEditing] = useState(false);  // Trạng thái để điều khiển việc hiển thị nút
  const [editUserInfo, setEditUserInfo] = useState(userInfo);
  const [isModalOpenUpdateUser, setIsModalOpenUpdateUser] = useState(false);

  const handleOpenModalUpdateUser = () => {
    setIsModalOpenUpdateUser(true);
  };

  const handleCloseModalUpdateUser = () => {
    setIsModalOpenUpdateUser(false);
  };
  const handleSaveUserInfo = (updatedUserInfo) => {
    // Gửi yêu cầu cập nhật thông tin người dùng
    dispatch(updateUserInfo(updatedUserInfo)).then(() => {
      showToast("Cập nhật thông tin thành công!", "success");
      // Gọi lại API để lấy thông tin mới nhất của người dùng
      dispatch(fetchUserInfo()).then((res) => {
        if (res.payload) {
          // Cập nhật lại thông tin người dùng vào state
          setUserInfo(res.payload.data);
          localStorage.setItem("userInfo", JSON.stringify(res.payload.data)); // Lưu lại vào localStorage
          setIsModalOpenUpdateUser(false); // Đóng modal
        }
      });
    });
  };


  const [activeSection, setActiveSection] = useState("info");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

 // Kiểm tra roleName từ userInfo
 const isUser = userInfo?.roleNames?.includes("user");

 // Xử lý các hành động khi người dùng có role là "user"
 const handleCreatePost = () => {
   if (isUser) {
     showToast("Bạn không có quyền tạo bài viết", "error");
     return;
   }
   setIsModalOpen(true);
 };


  const handleUpdatePost = (post) => {
    setSelectedPost(post); // Set the post to be updated
    setIsModalOpenUpdate(true); // Open the update modal
};
  

  //mở model add/update địa chỉ
  const [addressToEdit, setAddressToEdit] = useState(null); // Địa chỉ đang chỉnh sửa

  const handleAddAddress = () => {
    setAddressToEdit(null); // Không có địa chỉ nào để chỉnh sửa
    setIsAddressModalOpen(true); // Mở modal
  };

  const handleEditAddress = (address) => {
    setAddressToEdit(address); // Đặt địa chỉ cần chỉnh sửa
    setIsAddressModalOpen(true); // Mở modal
  };
  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleSaveAddress = (newAddress) => {
    if (addressToEdit) {
      // Truyền đúng đối tượng newAddress vào
      newAddress.id = addressToEdit.id;  // Đảm bảo id được truyền
      dispatch(updateAddress(newAddress)).then(() => {
        dispatch(fetchUserAddresses()); // Gọi lại fetchUserAddresses sau khi cập nhật thành công
      });
    } else {
      // Nếu là thêm mới địa chỉ
      dispatch(addAddress(newAddress)).then(() => {
        dispatch(fetchUserAddresses()); // Gọi lại fetchUserAddresses sau khi thêm mới thành công
      });
    }
    setIsAddressModalOpen(false); // Đóng modal
  };


  //hàm xóa address
  const handleDeleteAddress = (address) => {
    // Xác nhận trước khi xóa
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      dispatch(deleteAddress(address)).then(() => {
        dispatch(fetchUserAddresses()); // Gọi lại fetchUserAddresses sau khi xóa thành công
      });
    }
  };



  const orders = JSON.parse(localStorage.getItem("MyOrder"));
  //lấy thông tin đặt hàng thuốc của user
  useEffect(() => {
    // Lấy danh sách đơn hàng của user sau khi đã lấy thông tin người dùng
    if (userInfo) {
        dispatch(fetchUserOrders());
    }
  }, [dispatch, userInfo]);
  
  
  
  const filteredOrders = (orders || []).filter((order) => {
    return (
      (order.id && order.id.toString().includes(searchTerm)) || 
      order.item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  
  //mua lại sản phẩm

  

  const handleNavigation = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      {
        isLoading && (
          <div className="container mx-auto mt-8 flex gap-6">
            <div className="w-1/4 bg-white p-6 rounded-lg shadow flex flex-col items-start justify-start">
              <ul className="space-y-6 text-xl font-bold w-full">
                <li
                  className={`cursor-pointer ${activeSection === "info"
                    ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                    : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
                    }`}
                  onClick={() => handleNavigation("info")}
                >
                  <i className="fas fa-user mr-3"></i> Thông tin cá nhân
                  <i className="fas fa-chevron-right ml-2"></i>
                </li>

                <li
                  className={`cursor-pointer ${activeSection === "orders"
                    ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                    : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
                    }`}
                  onClick={() => handleNavigation("orders")}
                >
                  <i className="fas fa-box mr-3"></i> Đơn thuốc của tôi
                  <i className="fas fa-chevron-right ml-2"></i>
                </li>
                <li
                  className={`cursor-pointer ${activeSection === "address"
                    ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                    : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
                    }`}
                  onClick={() => handleNavigation("address")}
                >
                  <i className="fas fa-map-marker-alt mr-3"></i> Quản lý địa chỉ
                  <i className="fas fa-chevron-right ml-2"></i>
                </li>

                <li
                  className={`cursor-pointer ${activeSection === "create-post"
                    ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                    : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
                    }`}
                  onClick={handleCreatePost}
                >
                  <i className="fas fa-pencil-alt mr-3"></i> Tạo bài viết
                  <i className="fas fa-chevron-right ml-2"></i>
                </li>
                <li
                  className={`cursor-pointer ${activeSection === "my-post"
                    ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                    : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
                    }`}
                  onClick={() => handleNavigation("my-post")}
                >
                  <i className="fas fa-file-alt mr-3"></i> Bài viết của tôi
                  <i className="fas fa-chevron-right ml-2"></i>
                </li>
                <li
                  className={`cursor-pointer ${activeSection === "view-post"
                    ? "bg-blue-400 text-white rounded-lg py-2 px-4"
                    : "hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
                    }`}
                  onClick={() => handleNavigation("view-post")}
                >
                  <i className="fas fa-newspaper mr-3"></i> Xem tin tức
                  <i className="fas fa-chevron-right ml-2"></i>
                </li>
                <li
                  className={`cursor-pointer text-red-500 ${activeSection === "logout"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-500 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
                    }`}
                  onClick={() => {
                    handlerActionLogout();
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
                      className="w-30 h-30 rounded-full border border-gray-300"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1 bg-white p-1 rounded-lg shadow">
                {activeSection === "info" && (
                  userInfo ? (
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
                        <span>{userInfo.gender || "Chưa có thông tin"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Ngày sinh</span>
                        <span>{userInfo.dob || "Chưa có thông tin"}</span>
                      </div>

                      {/* Nút Chỉnh sửa sẽ mở Modal */}
                      <button
                        onClick={() => handleOpenModalUpdateUser(true)}  // Mở modal chỉnh sửa
                        className="px-6 py-2 bg-blue-500 font-semibold text-white rounded-xl w-full hover:bg-blue-600 mt-4"
                      >
                        Chỉnh sửa thông tin
                      </button>
                    </div>
                  ) : (
                    <p style={{ paddingTop: "20px", fontSize: "16px", textAlign: "center" }}>
                      Đang tải thông tin người dùng...
                    </p>
                  )
                )}
              </div>

              {/* Modal Update User Info */}
              <UpdateUserModal
                isOpen={isModalOpenUpdateUser}
                onClose={() => setIsModalOpenUpdateUser(false)}
                userInfo={userInfo}
                onSave={handleSaveUserInfo}
              />

            {activeSection === "orders" && (
              <div>
                <div className="-mx-6 -mt-6 bg-blue-500 text-white p-4 rounded-t-lg text-center">
                  <h3 className="text-2xl font-bold">Đơn thuốc của tôi</h3>
                </div>

                {/* Tìm kiếm */}
                <div className="flex gap-4 mb-4 items-center">
                  <input
                    type="text"
                    placeholder="Tìm theo mã đơn, tên sản phẩm..."
                    className="border p-3 rounded-lg w-full text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="fas fa-search text-gray-500 ml-2"></i>
                </div>

                {/* Filter buttons */}
                <div className="flex gap-4 mb-4">
                  <button className="px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center text-lg">
                    <i className="fas fa-box mr-2"></i> Tất cả
                  </button>
                  <button className="px-6 py-3 bg-gray-200 rounded-lg flex items-center text-lg">
                    <i className="fas fa-truck mr-2"></i> Đang giao
                  </button>
                  <button className="px-6 py-3 bg-gray-200 rounded-lg flex items-center text-lg">
                    <i className="fas fa-check mr-2"></i> Đã giao
                  </button>
                  <button className="px-6 py-3 bg-gray-200 rounded-lg flex items-center text-lg">
                    <i className="fas fa-trash-alt mr-2"></i> Đã hủy
                  </button>
                  <button className="px-6 py-3 bg-gray-200 rounded-lg flex items-center text-lg">
                    <i className="fas fa-undo mr-2"></i> Trả hàng
                  </button>
                </div>

                {/* Danh sách đơn hàng */}
                <div className="overflow-y-auto max-h-[500px]">
                {orders
                  .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))  // Sắp xếp theo ngày tạo đơn hàng mới nhất
                  .map((order) => (
                    <div key={order.id} className="flex flex-col border-b pb-4 mb-6">
                      
                      {/* Đơn hàng thông tin */}
                      <div className="flex justify-between mb-4">
                        <span className="text-lg font-medium">Đơn đặt ngày: {format(new Date(order.orderDate), "dd/MM/yyyy")} </span>
                        <span className="text-gray-500 text-lg" style={{position:'relative',right:'50px'}}>Mã đơn: {order.id}</span>
                      </div>

                      {/* Lặp qua các sản phẩm trong đơn hàng */}
                      {order.orderDetails.map((orderDetail, index) => (
                        <div key={index} className="flex items-center gap-6 mb-6">
                          
                          {/* Ảnh sản phẩm */}
                          <img
                            src={order.imageUrl || "/default-image.jpg"}
                            alt="Product"
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          
                          {/* Thông tin sản phẩm */}
                          <div className="flex flex-col w-full">
                          <div className="text-blue-600 font-medium text-lg">{order.nameProduct}</div>
                            <div className="text-black-500 text-lg w-2/4">Giá:{(orderDetail.price).toLocaleString()} VND</div>
              
                            <div className="text-black-600 text-lg">{orderDetail.quantity} {order.init}</div>
                          </div>

                          {/* Thành tiền */}
                          <div className="flex justify-between items-center w-full text-xl">
                            <span className="font-medium" style={{position:'relative', left:'220px',top:'20px'}}> Thành tiền: 
                              {orderDetail.price * orderDetail.quantity > 0 ?
                                (orderDetail.price * orderDetail.quantity).toLocaleString() : '0'} VND
                            </span>
                            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg" style={{position:'relative', top:'70px'}}
                            onClick={() => {
                              // Chuyển hướng đến trang sản phẩm
                              navigate(`/product/${order.productId}`); 
                            }}
                            >
                              Mua lại
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Địa chỉ nhận hàng */}
                      <div className="text-gray-600 mt-2 text-lg">
                        Địa chỉ nhận hàng: {order.addressDetail.street}, {order.addressDetail.ward}, {order.addressDetail.district}, {order.addressDetail.province}
                      </div>
                      
                      {/* Trạng thái đơn hàng */}
                      <div className="mt-2 text-gray-600 text-lg">
                        Trạng thái: <span className="font-semibold">{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* hiển thị tất cả bài viết của tôi */}
            {activeSection === "my-post" && !isUser && (
              <div className="text-center">
                <div className="-mx-6 -mt-6 bg-blue-500 text-white p-4 rounded-t-lg">
                  <h3 className="text-xl font-bold">Bài viết của tôi</h3>
                </div>
                {loadingMyPost ? (
                  <p>Đang tải...</p>
                ) : posts.length === 0 ? (
                  <p>Không có bài viết nào.</p>
                ) : (
                  <div className="space-y-4 mt-4">
                    <div className="post-container" style={{ maxHeight: '500px', overflowY: 'auto' }}> {/* Thêm thanh cuộn */}
                      {posts.map((post) => (
                        <div key={post.id} className="border-b pb-4 mb-4 flex justify-between items-center">
                          <div>
                            <h2 className="text-xl font-semibold text-left">
                              Tác giả: <span className="font-normal">{post.fullName}</span>
                            </h2>
                            <h2 className="text-xl font-semibold text-left">
                              Tiêu đề: <span className="font-normal">{post.title}</span>
                            </h2>
                            <div
                                className="ql-editor"
                                dangerouslySetInnerHTML={{ __html: post.content }} // Đảm bảo nội dung hiển thị đúng định dạng HTML
                            />
                            <div className="text-sm text-gray-500 text-left">
                              Ngày tạo: {format(new Date(post.createdAt), "HH:mm dd/MM/yyyy")}
                            </div>
                          </div>
                          <button
                            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            onClick={() => handleUpdatePost(post)}
                          >
                            Cập nhật
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={handleCreatePost}
                >
                  Tạo bài viết mới
                </button>
              </div>
            )}

            {/* Thông báo lỗi nếu là người dùng với role 'user' */}
            {isUser && ( 
              <div className="alert alert-warning">
                <p>Chức năng chỉ dành cho nhân viên.</p>
              </div>
            )}

            {/* Modal for updating the post */}
            {isModalOpenUpdate && selectedPost && (
              <UpdatePostPage
                setIsModalOpen={setIsModalOpenUpdate}
                postToEdit={selectedPost}
              />
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
                    {Array.isArray(userAddresses) && userAddresses.length > 0 ? (
                      userAddresses.map((address) => (
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
                          <div className="flex items-center space-x-4">
                            <button
                              className="text-blue-500 font-semibold"
                              style={{ fontSize: 20 }}
                              onClick={() => handleEditAddress(address)} // Mở modal chỉnh sửa
                            >
                              Sửa
                            </button>
                            <button
                              className="text-red-500 font-semibold"
                              style={{ fontSize: 20 }}
                              onClick={() => handleDeleteAddress(address)} // Mở modal xóa
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))) : (
                      <p>Không có địa chỉ nào.</p>
                    )}
                  </div>
                  <div className="flex justify-center mt-auto mb-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      onClick={handleAddAddress} // Mở modal thêm mới địa chỉ
                    >
                      Thêm địa chỉ mới
                    </button>
                  </div>
                </div>
              )}{/* Modal Add/Edit Address */}
              <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                addressToEdit={addressToEdit}
                onSave={handleSaveAddress}
              />

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
        )
      }
      <Footer />
    </div>
  );
};
