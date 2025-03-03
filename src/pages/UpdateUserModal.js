// UpdateUserModal.js
import React, { useState } from "react";
import { showToast } from "../utils/AppUtils";
const UpdateUserModal = ({ isOpen, onClose, onSave }) => {


  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [editUserInfo, setEditUserInfo] = useState({
    gender: userInfo.gender || "Male",
    dob: userInfo.dob || "",
    fullName: userInfo.fullName || "",
    username: userInfo.username || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUserInfo({
      ...editUserInfo,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(editUserInfo);
    onClose(); // Đóng modal sau khi lưu
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-bold mb-4">Cập nhật thông tin</h3>
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              value={editUserInfo.fullName || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Họ và tên"
            />
            <input
              type="text"
              name="username"
              disabled
              value={editUserInfo.username || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Số điện thoại"
            />
            <select
              name="gender"
              value={editUserInfo.gender || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
            <input
              type="date"
              name="dob"
              value={editUserInfo.dob || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Ngày sinh"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdateUserModal;