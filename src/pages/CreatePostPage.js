import React, { useState, useEffect } from "react";
import { fetchCreatePost } from "../redux/slice/PostSlice";
import showToast from "../utils/AppUtils";
import { useDispatch, useSelector } from "react-redux";


export const CreatePostPage = ({ setIsModalOpen }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const dispatch = useDispatch();  // Hook để dispatch action

    const handleSubmit = (e) => {
        e.preventDefault();

        // Gọi API tạo bài viết qua Redux
        dispatch(fetchCreatePost({ title, content })).then(() => {
            showToast("Cập nhật thông tin thành công!", "success");
            setIsModalOpen(false);  // Đóng modal khi tạo bài viết thành công
        }).catch(err => {
            console.log("Error creating post:", err);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1000 }}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h1 className="text-2xl font-bold mb-4">Tạo Bài Viết</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-medium">Tiêu đề</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Nhập tiêu đề bài viết"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium">Nội dung</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)} // Cần phải lấy e.target.value
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            style={{ minHeight: "200px", maxHeight: "400px", overflowY: "auto" }}
                            placeholder="Nhập nội dung bài viết"
                        />

                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                            onClick={() => setIsModalOpen(false)} // Đóng modal khi nhấn hủy
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                            Đăng Bài Viết
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;