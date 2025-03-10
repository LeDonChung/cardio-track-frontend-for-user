import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUpdatePost,fetchMyListPost } from "../redux/slice/PostSlice";
import showToast from "../utils/AppUtils";

export const UpdatePostPage = ({ setIsModalOpen, postToEdit }) => {
    const [title, setTitle] = useState(postToEdit ? postToEdit.title : "");
    const [content, setContent] = useState(postToEdit ? postToEdit.content : "");
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(fetchUpdatePost({ id: postToEdit.id, title, content })).then(() => {
            showToast("Cập nhật bài viết thành công!", "success");
            setIsModalOpen(false);  // Đóng modal khi cập nhật bài viết thành công
            dispatch(fetchMyListPost());
        }).catch(err => {
            console.log("Error updating post:", err);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1000 }}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h1 className="text-2xl font-bold mb-4">Cập Nhật Bài Viết</h1>
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
                            onChange={(e) => setContent(e.target.value)}
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
                            Cập Nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePostPage;