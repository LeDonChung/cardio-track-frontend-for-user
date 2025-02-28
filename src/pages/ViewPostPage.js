import { useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const ViewPostPage = () => {
    const { title } = useParams();  // Lấy tên bài viết từ URL
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        setComments([...comments, comment]);
        setComment("");
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="container mx-auto mt-8 flex gap-6">
                {/* Sidebar */}
                <div className="w-1/4 bg-white p-6 rounded-lg shadow flex flex-col items-start justify-start">
                    <ul className="space-y-6 text-xl font-bold w-full">
                        <li className="cursor-pointer hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">Thông tin cá nhân</li>
                        <li className="cursor-pointer hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">Mã QR của tôi</li>
                        <li className="cursor-pointer hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">Đơn thuốc của tôi</li>
                        <li className="cursor-pointer hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">Quản lý địa chỉ</li>
                        <li className="cursor-pointer hover:bg-blue-400 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">Quản lý thanh toán</li>
                        <li className="cursor-pointer text-red-500 hover:bg-blue-500 hover:text-white hover:rounded-lg hover:py-2 hover:px-4">Đăng xuất</li>
                    </ul>
                </div>

                {/* Main Content - xem bài viết */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-center border-b pb-4 mb-4">
                        <div className="flex items-center space-x-4 flex-col">
                            <h1 className="text-2xl font-bold mb-2">{title}</h1>
                            <p className="text-gray-600 mb-4">Nội dung bài viết về sức khỏe...</p>
                            <div className="text-sm text-gray-500">Tác giả: Nguyễn Văn A</div>
                            <div className="text-sm text-gray-500">Ngày tạo: 01/01/2024</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4">Bình luận</h2>
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                rows="4"
                                placeholder="Viết bình luận của bạn..."
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            >
                                Thêm bình luận
                            </button>
                        </form>

                        <div className="mt-6 space-y-4">
                            {comments.map((comment, index) => (
                                <div key={index} className="border-b pb-4 mb-4">
                                    <p className="text-gray-800">{comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
