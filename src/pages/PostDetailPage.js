import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchSearchPost, fetchComments, addComment } from "../redux/slice/PostSlice"; // Make sure you import fetchSearchPost correctly
import { format } from "date-fns";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const PostDetailPage = () => {
    const { title } = useParams(); // Get the title from the URL parameters
    const dispatch = useDispatch();
    const post = useSelector((state) => state.post.searchPost[0]); // Get the post from the state
    const comments = useSelector((state) => state.post.comments);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [newComment, setNewComment] = useState("");
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    // Fetch post by title when the component mounts
    useEffect(() => {
        dispatch(fetchSearchPost(title)) // Dispatch action to fetch post by title
            .catch((err) => {
                console.error("Error fetching post:", err);
            });
    }, [dispatch, title]);

    // Open comment modal and fetch comments for the post
    const openCommentModal = () => {
        dispatch(fetchComments(post.id)); // Fetch comments for the post
        setIsCommentModalOpen(true); // Open the comment modal
    };

    // Handle adding a new comment
    const handleAddComment = () => {
        if (newComment.trim()) {
            const commentData = {
                content: newComment,
                postId: post.id,
                authorId: userInfo.id,
            };
            dispatch(addComment(commentData)).then(() => {
                // Fetch comments again after adding a new one
                dispatch(fetchComments(post.id));
                setNewComment(""); // Reset comment input
            }).catch((err) => {
                console.log("Error adding comment:", err);
            });
        }
    };

    return (
        <div className="bg-[#EDF0F3] text-gray-900 min-h-screen">
            <Header />
            <div className="container mx-auto p-6 flex justify-center">
                {/* Left Image Section */}
                <div className="hidden md:block w-1/6 mr-4">
                    <img src="https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/05_b2be0c4e26.png" alt="Side image" className="w-full h-auto rounded-lg shadow-md" />
                </div>

                {/* Post Detail */}
                <div className="w-full md:w-9/12 lg:w-7/12">
                    {post ? (
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <img src={post.imgTitle} alt="Post" className="w-full h-auto rounded-lg mb-4" />
                            <div className="text-sm text-gray-500 mb-4">Ngày đăng: {format(new Date(post.createdAt), "dd/MM/yyyy HH:mm")}</div>
                            <h2 className="text-3xl font-semibold text-blue-600 mb-4">{post.title}</h2>
                            <div className="text-lg text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
                            <div className="text-sm text-gray-500 mb-4">Tác giả: {post.fullName}</div>
                           
                            
                            {/* Comment button */}
                            <button
                                onClick={openCommentModal}
                                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Bình luận ({comments.length || 0})
                            </button>
                        </div>
                    ) : (
                        <p>Đang tải bài viết...</p>
                    )}
                </div>
            </div>

            {/* Modal for Comments */}
            {isCommentModalOpen && post && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/2">
                        <h3 className="text-xl font-bold mb-4">Bình luận cho bài viết: {post.title}</h3>
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
                            <div className="space-y-4 mt-4 max-h-60 overflow-y-auto">
                                {comments.length > 0 ? (
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

            <Footer />
        </div>
    );
};
