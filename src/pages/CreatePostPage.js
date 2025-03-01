// import React, { useState } from "react";



// export const CreatePostPage = ({ setIsModalOpen }) => {
//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");
//     const [author, setAuthor] = useState("");

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Logic to create post (e.g., send data to server or store it in state)
//         // Sau khi tạo bài viết thành công, bạn có thể đóng modal
//         setIsModalOpen(false);
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1000 }}>
            
//             <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
//                 <h1 className="text-2xl font-bold mb-4">Tạo Bài Viết</h1>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block font-medium">Tiêu đề</label>
//                         <input
//                             type="text"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             className="w-full p-3 border border-gray-300 rounded-lg"
//                             placeholder="Nhập tiêu đề bài viết"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block font-medium">Nội dung</label>
//                         <textarea
//                             value={content}
//                             onChange={(e) => setContent(e.target.value)}
//                             className="w-full p-3 border border-gray-300 rounded-lg"
//                             rows="5"
//                             placeholder="Nhập nội dung bài viết"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block font-medium">Tác giả</label>
//                         <input
//                             type="text"
//                             value={author}
//                             onChange={(e) => setAuthor(e.target.value)}
//                             className="w-full p-3 border border-gray-300 rounded-lg"
//                             placeholder="Nhập tên tác giả"
//                         />
//                     </div>
//                     <div className="flex justify-end space-x-4">
//                         <button
//                             type="button"
//                             className="bg-gray-500 text-white py-2 px-4 rounded-lg"
//                             onClick={() => setIsModalOpen(false)} // Đóng modal khi nhấn hủy
//                         >
//                             Hủy
//                         </button>
//                         <button
//                             type="submit"
//                             className="bg-blue-500 text-white py-2 px-4 rounded-lg"
//                         >
//                             Đăng Bài Viết
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// <style>
// {`
//     .fixed {
//         position: fixed;
//         top: 0;
//         left: 0;
//         right: 0;
//         bottom: 0;
//         z-index: 1000; /* Đảm bảo modal nằm trên các thành phần khác */
//         display: flex;
//         align-items: center; /* Căn giữa theo chiều dọc */
//         justify-content: center; /* Căn giữa theo chiều ngang */
//     }
// `}
// </style>