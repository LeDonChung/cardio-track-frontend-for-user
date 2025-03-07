import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CreatePostPage } from "./CreatePostPage";
import { fetchMyListPost } from "../redux/slice/PostSlice"; // Import action để lấy bài viết của tôi

 const ViewMyPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((state) => state.post.posts) || []; // Lấy bài viết từ redux store
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreatePostModal = () => {
    setIsModalOpen(true); // Mở modal khi nhấn "Tạo bài viết"
  };

  const handleCloseCreatePostModal = () => {
    setIsModalOpen(false); // Đóng modal
  };

  useEffect(() => {
    // Gọi API lấy bài viết của người dùng
    dispatch(fetchMyListPost())
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto mt-8 flex gap-6">
        {/* Sidebar */}
        <div className="w-1/4 bg-white p-6 rounded-lg shadow flex flex-col items-start justify-start">
          <ul className="space-y-6 text-xl font-bold w-full">
            <li className="cursor-pointer hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">
              Thông tin cá nhân
            </li>
            <li className="cursor-pointer hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">
              Quản lý địa chỉ
            </li>
            <li className="cursor-pointer hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">
              Đơn thuốc của tôi
            </li>
            <li
              className="cursor-pointer hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4"
              onClick={handleOpenCreatePostModal} // Mở modal tạo bài viết
            >
              Tạo bài viết
            </li>
            <li className="cursor-pointer hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">
              Bài viết của tôi
            </li>
            <li className="cursor-pointer text-red-500 hover:bg-blue-500 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">
              Đăng xuất
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Bài viết của tôi</h1>

          {loading ? (
            <p>Đang tải...</p>
          ) : posts.length === 0 ? (
            <p>Không có bài viết nào.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p>{post.content}</p>
                  <div className="text-sm text-gray-500">Ngày tạo: {post.createdAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Mở modal tạo bài viết */}
      {isModalOpen && <CreatePostPage setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

export default ViewMyPost;
