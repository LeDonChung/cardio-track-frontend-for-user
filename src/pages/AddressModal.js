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

  //dùng api lấy thành phố quận huyện...
  // States for province, district, and ward options
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // const proxyUrl = "https://cors-anywhere.herokuapp.com/";

  useEffect(() => {
    // Fetch provinces when the component mounts
    fetch("https://provinces.open-api.vn/api/p")
      .then((response) => response.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (address.province) {
      // Fetch districts when province is selected
      const selectedProvince = provinces.find((province) => province.name === address.province);
      if (selectedProvince) {
        fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
          .then((response) => response.json())
          .then((data) => setDistricts(data.districts))
          .catch((error) => console.error("Error:", error));
      }
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [address.province, provinces]);

  useEffect(() => {
    if (address.district) {
      // Fetch wards when district is selected
      const selectedDistrict = districts.find((district) => district.name === address.district);
      if (selectedDistrict) {
        fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
          .then((response) => response.json())
          .then((data) => setWards(data.wards))
          .catch((error) => console.error("Error:", error));
      }
    } else {
      setWards([]);
    }
  }, [address.district, districts]);

  useEffect(() => {
    if (addressToEdit) {
      setAddress(addressToEdit); // Nếu có địa chỉ đang chỉnh sửa, điền vào form
    }
  }, [addressToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "province") {
      const selectedProvince = provinces.find((province) => province.code === parseInt(value));
      setAddress((prevState) => ({
        ...prevState,
        province: selectedProvince ? selectedProvince.name : "",
        district: "",
        ward: "",
      }));
    } else if (name === "district") {
      const selectedDistrict = districts.find((district) => district.code === parseInt(value));
      setAddress((prevState) => ({
        ...prevState,
        district: selectedDistrict ? selectedDistrict.name : "",
        ward: "",
      }));
    } else if (name === "ward") {
      const selectedWard = wards.find((ward) => ward.code === parseInt(value));
      setAddress((prevState) => ({
        ...prevState,
        ward: selectedWard ? selectedWard.name : "",
      }));
    } else {
      setAddress((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
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
            <select
              name="province"
              value={provinces.find((province) => province.name === address.province)?.code || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {Array.isArray(provinces) && provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>

            <select
              name="district"
              value={districts.find((district) => district.name === address.district)?.code || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled={!address.province}
            >
              <option value="">Chọn quận/huyện</option>
              {Array.isArray(districts) && districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>

            <select
              name="ward"
              value={wards.find((ward) => ward.name === address.ward)?.code || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled={!address.district}
            >
              <option value="">Chọn phường/xã</option>
              {Array.isArray(wards) && wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>

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
              className="px-4 py-2 bg-blue-400 text-white rounded-lg"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default AddressModal;