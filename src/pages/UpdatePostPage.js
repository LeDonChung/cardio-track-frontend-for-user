import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUpdatePost, fetchMyListPost } from "../redux/slice/PostSlice";
import showToast from "../utils/AppUtils";
import ReactQuill from "react-quill-new"; // Import react-quill-new
import "react-quill-new/dist/quill.snow.css"; // Import CSS style for Quill

// Toolbar modules for formatting (optional)
const modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: ["small", "medium", "large", "huge", "10px", "12px", "14px", "18px", "24px", "36px"] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        ["link", "image"],
        [{ color: [] }, { background: [] }],
        ["clean"]
    ]
};

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
                        <ReactQuill
                            value={content}
                            onChange={setContent} // Cập nhật nội dung
                            className="w-full p-3 border border-gray-300 rounded-lg custom-quill"
                            style={{
                                minHeight: "300px", // Tăng chiều cao mặc định
                                maxHeight: "600px", // Giới hạn chiều cao tối đa
                                overflowY: "auto", // Thêm cuộn dọc nếu nội dung quá dài
                                resize: "both", // Cho phép người dùng thay đổi kích thước
                                fontSize: "18px" // Tùy chỉnh kích thước chữ mặc định
                            }}
                            placeholder="Nhập nội dung bài viết"
                            modules={modules} // Sử dụng modules đã cấu hình
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

            <style jsx>{`
    .ql-size {
        font-size: 16px; /* Đảm bảo kích thước chữ mặc định */
    }

    .ql-size .ql-picker-item {
        font-size: 16px !important; /* Đảm bảo các item trong dropdown có kích thước đúng */
    }

    .ql-size .ql-picker-item[data-value="10px"] {
        font-size: 10px !important; /* Cập nhật size chữ cho từng giá trị cụ thể */
    }

    .ql-size .ql-picker-item[data-value="12px"] {
        font-size: 12px !important;
    }

    .ql-size .ql-picker-item[data-value="14px"] {
        font-size: 14px !important;
    }

    .ql-size .ql-picker-item[data-value="18px"] {
        font-size: 18px !important;
    }

    .ql-size .ql-picker-item[data-value="24px"] {
        font-size: 24px !important;
    }

    .ql-size .ql-picker-item[data-value="36px"] {
        font-size: 36px !important;
    }

    .ql-size .ql-picker-item.ql-selected {
        background-color: #e0e0e0; /* Tô màu nền cho item đã chọn */
        font-weight: bold;
    }

    .ql-size .ql-picker-item:hover {
        background-color: #f0f0f0; /* Tô màu nền khi hover */
    }
`}</style>

        </div>
    );
};

export default UpdatePostPage;
