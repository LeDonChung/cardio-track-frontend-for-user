import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllListPost } from "../redux/slice/PostSlice"; 
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { format } from "date-fns";
import UpdatePostPage from "./UpdatePostPage"; // Import UpdatePostPage modal

export const NewsPage = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.myPosts);
    const loading = useSelector((state) => state.post.loading);
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Thông tin người dùng hiện tại

    const [selectedPost, setSelectedPost] = useState(null); // Để lưu bài viết cần cập nhật
    const [isModalOpen, setIsModalOpen] = useState(false); // Để điều khiển việc hiển thị modal

    // Mở modal khi nhấn nút cập nhật
    const openUpdateModal = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);  // Mở modal
    };

    useEffect(() => {
        dispatch(fetchAllListPost());  // Gọi API để lấy tất cả bài viết
    }, [dispatch]);

    // Tạo một bản sao của mảng và sắp xếp theo thời gian tạo (createdAt), từ mới nhất đến cũ nhất
    const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="bg-[#EDF0F3] text-gray-900 min-h-screen">
            <Header />
            <div className="container mx-auto p-6 flex justify-center">
                {/* Hình ảnh bên trái */}
                <div className="hidden md:block w-1/6 mr-4">
                    <img src="https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/05_b2be0c4e26.png" alt="Side image" className="w-full h-auto rounded-lg shadow-md"/>
                    <img src="https://vivita.vn/wp-content/uploads/2022/06/CTKM-Vivita-2-compressed.jpg" alt="Side image1" className="w-full h-auto rounded-lg shadow-md mt-4"/>
                    <img src="https://nhatduoc.vn/wp-content/uploads/2019/04/14.jpg" alt="Side image2" className="w-full h-auto rounded-lg shadow-md mt-4"/>
                </div>

                {/* Nội dung tin tức */}
                <div className="w-full md:w-9/12 lg:w-7/12">
                    <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Tin tức và sự kiện</h1>

                    {loading ? (
                        <p>Đang tải bài viết...</p>
                    ) : sortedPosts.length === 0 ? (
                        <p>Không có bài viết nào.</p>
                    ) : (
                        <div className="space-y-4">
                            {sortedPosts.map((post) => (
                                <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
                                    <h2 className="text-xl font-semibold mb-2 text-blue-600">{post.title}</h2>
                                    <h3 className="text-sm text-gray-500 mb-4">Tác giả: <span className="font-normal">{post.fullName}</span></h3>
                                    <div 
                                        className="text-lg text-gray-700 mb-4"
                                        dangerouslySetInnerHTML={{ __html: post.content }} // Hiển thị nội dung bài viết với định dạng HTML
                                    />
                                    <div className="text-sm text-gray-500">
                                        Ngày đăng: {format(new Date(post.createdAt), "dd/MM/yyyy HH:mm")}
                                    </div>
                                    {/* Hiển thị nút Cập nhật nếu người dùng là chủ của bài viết */}
                                    {userInfo && userInfo.id === post.authorId && (
                                        <button
                                            onClick={() => openUpdateModal(post)}  // Mở modal cập nhật
                                            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            Cập nhật
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hình ảnh bên phải */}
                <div className="hidden md:block w-1/4 ml-4">
                    <img src="https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/05_b2be0c4e26.png" alt="Side image1" className="w-full h-auto rounded-lg shadow-md"/>
                    <img src="https://vivita.vn/wp-content/uploads/2022/06/CTKM-Vivita-2-compressed.jpg" alt="Side image11" className="w-full h-auto rounded-lg shadow-md mt-4"/>
                    <img src="https://nhatduoc.vn/wp-content/uploads/2019/04/14.jpg" alt="Side image21" className="w-full h-auto rounded-lg shadow-md mt-4"/>
                </div>
            </div>

            {/* Modal Update Post */}
            {isModalOpen && selectedPost && (
                <UpdatePostPage
                    setIsModalOpen={setIsModalOpen} // Truyền setIsModalOpen để đóng modal
                    postToEdit={selectedPost} // Truyền bài viết cần sửa
                />
            )}
            <Footer />
        </div>
    );
};

export default NewsPage;
