import React, { useState } from "react";
import ReactQuill from "react-quill-new"; // Import react-quill-new
import "react-quill-new/dist/quill.snow.css"; // Import CSS style for Quill
import { fetchCreatePost, fetchMyListPost ,uploadImage } from "../redux/slice/PostSlice";
import showToast from "../utils/AppUtils";
import { useDispatch,useSelector  } from "react-redux";



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

export const CreatePostPage = ({ setIsModalOpen }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imgTitle, setImgTitle] = useState(""); // State to hold selected image
    const dispatch = useDispatch();  // Hook để dispatch action

    //const imgUrl = useSelector(state => state.post.imgUrl);
    // Handle file change
    // Handle file change
const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase(); // Lấy đuôi tệp

    // Kiểm tra loại tệp
    if (!["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
        showToast("Chỉ chấp nhận hình ảnh có định dạng: JPG, JPEG, PNG, GIF", "error");
        e.target.value = ""; // Reset giá trị của input file
        setImgTitle(null); // Xóa tệp đã chọn
        return;
    }

    // Upload ảnh lên S3 và lấy URL
    const formData = new FormData();
formData.append("file", file);  // Gửi tệp ảnh vào formData

try {
    const imgUrl = await dispatch(uploadImage(formData)).unwrap();  // Tải ảnh lên và nhận URL
    setImgTitle(imgUrl);  // Lưu URL của ảnh vào state
    //console.log("Uploaded image URL:", imgUrl);  // In ra URL đã tải lên
} catch (error) {
    console.error("Error uploading image:", error);
    showToast("Lỗi khi tải ảnh lên", "error");
}
};


const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
        showToast("Tiêu đề không được để trống", "error");
        return;
    }

    if (!content.trim()) {
        showToast("Nội dung không được để trống", "error");
        return;
    }

    if (!imgTitle) {
        showToast("Vui lòng chọn ảnh tiêu đề", "error");
        return;
    }

    // Tạo FormData để gửi hình ảnh cùng các dữ liệu bài viết
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("imgTitle", imgTitle); // Append URL ảnh vào formData
    // Gọi API tạo bài viết qua Redux
    dispatch(fetchCreatePost(formData)).then(() => {
        dispatch(fetchMyListPost()).then(() => {
            showToast("Cập nhật bài viết thành công!", "success");
            setIsModalOpen(false);
        });
    }).catch(err => {
        console.log("Error creating post:", err);
    });
};
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1000 }}>
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-auto" style={{ width: "80%", maxHeight: "80vh", overflowY: "auto" }}>
                <h1 className="text-2xl font-bold mb-4">Tạo Bài Viết</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-2xl font-bold">Tiêu đề</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Nhập tiêu đề bài viết"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-2xl font-bold">Nội dung</label>
                        <ReactQuill
                            value={content}
                            onChange={setContent} // Cập nhật nội dung
                            className="w-full p-3 border border-gray-300 rounded-lg custom-quill"
                            style={{                                                             
                                minHeight: "300px", // Tăng chiều cao mặc định
                                maxHeight: "600px", // Giới hạn chiều cao tối đa
                                overflowY: "auto", // Thêm cuộn dọc nếu nội dung quá dài
                               
                            }}
                            placeholder="Nhập nội dung bài viết" 
                            modules={modules} // Sử dụng modules đã cấu hình
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-1xl font-bold">Hình tiêu đề</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange} // Không cần value cho file input
                            className="w-full p-2 border border-gray-300 rounded-lg"
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
        </div>
    );
};

export default CreatePostPage;


