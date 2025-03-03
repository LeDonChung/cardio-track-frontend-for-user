import { useState, useEffect } from "react";

 const AddressModal = ({ isOpen, onClose, addressToEdit, onSave }) => {


    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo ? userInfo.id : null; // Kiểm tra nếu có userInfo thì lấy id, nếu không thì null
    
  const [address, setAddress] = useState({
    district: "",
    province: "",
    ward: "",
    street: "",
    addressType: "HOME", // Mặc định là 'HOME'
    fullName: "",
    phoneNumber: "",
    userId: userId,
    orderId: null,
  });


  useEffect(() => {
    if (addressToEdit) {
      setAddress(addressToEdit); // Nếu có địa chỉ đang chỉnh sửa, điền vào form
    }
  }, [addressToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { fullName, phoneNumber, street, ward, district, province } = address;
    if (!fullName || !phoneNumber || !street || !ward || !district || !province) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return false;
    }
    return true;
  };
  
  const handleSave = () => {
    if (validateForm()) {
      onSave(address);
    }
  };
  

  return (
    isOpen ? (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-bold mb-4">
            {addressToEdit ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
              placeholder="Họ và tên"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="phoneNumber"
              value={address.phoneNumber}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="Đường"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="ward"
              value={address.ward}
              onChange={handleChange}
              placeholder="Phường"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="district"
              value={address.district}
              onChange={handleChange}
              placeholder="Quận"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="province"
              value={address.province}
              onChange={handleChange}
              placeholder="Tỉnh/Thành phố"
              className="w-full border p-2 rounded"
            />
            
            <div>
              <label className="block mb-2">Loại địa chỉ</label>
              <select
                name="addressType"
                value={address.addressType}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="HOME">Nhà</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
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
    ): null
  );
};
export default AddressModal;