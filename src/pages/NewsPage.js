import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllListPost, fetchComments, addComment } from "../redux/slice/PostSlice"; 
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { format } from "date-fns";
import UpdatePostPage from "./UpdatePostPage"; // Import UpdatePostPage modal

export const NewsPage = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.myPosts);
    const comments = useSelector((state) => state.post.comments); // Lấy danh sách bình luận
    const loading = useSelector((state) => state.post.loading);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const [selectedPost, setSelectedPost] = useState(null); // Để lưu bài viết cần cập nhật
    const [isModalOpen, setIsModalOpen] = useState(false); // Để điều khiển việc hiển thị modal cập nhật
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");

    const [currentPost, setCurrentPost] = useState(null); // Để lưu bài viết hiện tại đang bình luận

    const openUpdateModal = (post) => {
        setSelectedPost(post);  // Lưu bài viết cần cập nhật
        setIsModalOpen(true);  // Mở modal
    };

    useEffect(() => {
        dispatch(fetchAllListPost());
    }, [dispatch]);

    const openCommentModal = (post) => {
        setCurrentPost(post); // Lưu bài viết hiện tại
        dispatch(fetchComments(post.id)); // Lấy danh sách bình luận của bài viết
        setIsCommentModalOpen(true); // Mở modal bình luận
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            const commentData = {
                content: newComment,
                postId: currentPost.id,
                authorId: userInfo.id,
            };
            dispatch(addComment(commentData)).then(() => {
                // Gửi bình luận lên server và tải lại bình luận sau khi thêm thành công
                dispatch(fetchComments(currentPost.id));
                setNewComment(""); // Reset ô nhập
            }).catch(err => {
                console.log("Error adding comment:", err);
            });
        }
    };

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

                <div className="w-full md:w-9/12 lg:w-7/12">
                    <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Tin tức và sự kiện</h1>
                    {loading ? (
                        <p>Đang tải bài viết...</p>
                    ) : posts.length === 0 ? (
                        <p>Không có bài viết nào.</p>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
                                    <h2 className="text-xl font-semibold mb-2 text-blue-600">{post.title}</h2>
                                    <h3 className="text-sm text-gray-500 mb-4">Tác giả: <span className="font-normal">{post.fullName}</span></h3>
                                    <div className="text-lg text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
                                    <div className="text-sm text-gray-500">Ngày đăng: {format(new Date(post.createdAt), "dd/MM/yyyy HH:mm")}</div>

                                    {/* Hiển thị nút Cập nhật nếu người dùng là chủ của bài viết */}
                                    {userInfo && userInfo.id === post.authorId && (
                                        <button
                                            onClick={() => openUpdateModal(post)}  // Mở modal cập nhật
                                            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            Cập nhật
                                        </button>
                                    )}

                                    {/* Nút Bình luận với số lượng bình luận */}
                                    <button
                                        onClick={() => openCommentModal(post)}  // Mở modal bình luận
                                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Bình luận({post.soluongbinhluan || 0}) {/* Hiển thị số lượng bình luận */}
                                    </button>
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

            {/* Modal Bình luận */}
            {isCommentModalOpen && currentPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/2">
                        <h3 className="text-xl font-bold mb-4">Bình luận cho bài viết: {currentPost.title}</h3>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                            placeholder="Nhập bình luận của bạn..."
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleAddComment}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                Đăng bình luận
                            </button>
                            <button
                                onClick={() => setIsCommentModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                            >
                                Hủy
                            </button>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold">Danh sách bình luận:</h4>
                            <div className="space-y-4 mt-4 max-h-60 overflow-y-auto"> {/* Thêm thanh cuộn */}
                                {Array.isArray(comments) && comments.length > 0 ? (
                                    comments.map((comment) => {
                                        const commentDate = new Date(comment.createdAt);
                                        const formattedDate = commentDate.getTime() > 0 ? format(commentDate, "dd/MM/yyyy HH:mm") : "Ngày không hợp lệ";

                                        return (
                                            <div key={comment.id} className="p-3 border-b border-gray-200">
                                                <p><strong>{comment.fullName}</strong>: {comment.content}</p>
                                                <p className="text-sm text-gray-500">{formattedDate}</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>Không có bình luận nào.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
