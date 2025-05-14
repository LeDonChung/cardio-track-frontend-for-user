import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { addAddressThunk } from '../redux/slice/CartSlice';  
import showToast from '../utils/AppUtils';

const AddressFormModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [street, setStreet] = useState('');
    const [addressType, setAddressType] = useState('HOME');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [user, setUser] = useState({});

    // Fetch provinces when the component is mounted
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/')
            .then((response) => response.json())
            .then((data) => setProvinces(data));

        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            setUser(user);
            setFullName(user.fullName);
            setPhoneNumber(user.username);  
        }
    }, []);

    const handleFullNameChange = (e) => {
        setFullName(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleStreetChange = (e) => {
        setStreet(e.target.value);
    };

    const handleAddressTypeChange = (e) => {
        setAddressType(e.target.value);  // Cập nhật addressType khi người dùng chọn
    };

    const provinceOptions = provinces.map((province) => ({
        value: province.code,
        label: province.name,
    }));

    const districtOptions = districts.map((district) => ({
        value: district.code,
        label: district.name,
    }));

    const wardOptions = wards.map((ward) => ({
        value: ward.code,
        label: ward.name,
    }));

    const addressTypeOptions = [
        { value: 'HOME', label: 'HOME' },
        { value: 'OTHER', label: 'OTHER' },
    ];

    const handleProvinceChange = (e) => {
        setSelectedProvince(e);
        setSelectedDistrict(null);
        setSelectedWard(null);

        fetch(`https://provinces.open-api.vn/api/p/${e.value}?depth=2`)
            .then((response) => response.json())
            .then((data) => setDistricts(data.districts));
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrict(e);
        setSelectedWard(null);

        fetch(`https://provinces.open-api.vn/api/d/${e.value}?depth=2`)
            .then((response) => response.json())
            .then((data) => setWards(data.wards));
    };

    const handleWardChange = (e) => {
        setSelectedWard(e);
    };

    if (!isOpen) return null;

    const customSelectStyles = {
        control: (base) => ({
            ...base,
            width: '100%',
            height: '42px',
            padding: '0 10px',
            borderRadius: '5px',
            fontSize: '16px',
        }),
        option: (base) => ({
            ...base,
            fontSize: '16px',
        }),
        menu: (base) => ({
            ...base,
            fontSize: '16px',
        }),
    };

    // Hàm xử lý khi người dùng nhấn nút "Lưu"
    const handleSaveAddress = () => {
        const token = localStorage.getItem('token');

        // Kiểm tra thông tin bắt buộc
        if (!user.id || !token) {
            console.log(user.id, token);
            showToast('Vui lòng đăng nhập để lưu địa chỉ!', 'error');
            return;
        }

        // Kiểm tra các trường thông tin bắt buộc
        if (!fullName || !phoneNumber || !selectedProvince || !selectedDistrict || !selectedWard || !street || !addressType) {
            showToast('Vui lòng điền đầy đủ thông tin địa chỉ!', 'error');
            return;
        }

        console.log('Địa chỉ:', {
            fullName,
            phoneNumber,
            province: selectedProvince.label,
            district: selectedDistrict.label,
            ward: selectedWard.label,
            street,
            addressType,
        });

        const addressData = {
            fullName,
            phoneNumber,
            province: selectedProvince ? selectedProvince.label : '',
            district: selectedDistrict ? selectedDistrict.label : '',
            ward: selectedWard ? selectedWard.label : '',
            street,
            addressType,  // Thêm addressType vào dữ liệu gửi đi
        };

        // Dispatch action addAddressThunk
        dispatch(addAddressThunk({ addressData }));

        // Đóng modal sau khi lưu
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-auto max-h-[90vh] w-1/2 min-w-[300px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-center flex-grow">Thêm địa chỉ mới</h3>
                    <button onClick={onClose} className="text-3xl text-gray-600 hover:text-gray-800">
                        <span>&times;</span>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Họ và tên người nhận"
                        className="border p-2 rounded-md w-full"
                        value={fullName}
                        onChange={handleFullNameChange}
                    />
                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        className="border p-2 rounded-md w-full"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <Select
                        options={provinceOptions}
                        onChange={handleProvinceChange}
                        value={selectedProvince || ''}
                        placeholder="Tỉnh"
                        className="custom-select"
                        styles={customSelectStyles}
                    />
                    <Select
                        options={districtOptions}
                        onChange={handleDistrictChange}
                        value={selectedDistrict || ''}
                        placeholder="Quận/huyện"
                        className="custom-select"
                        isDisabled={!selectedProvince}
                        styles={customSelectStyles}
                    />
                </div>
                <Select
                    options={wardOptions}
                    onChange={handleWardChange}
                    value={selectedWard || ''}
                    placeholder="Chọn phường/xã"
                    className="custom-select mb-4"
                    isDisabled={!selectedDistrict}
                    styles={customSelectStyles}
                />
                <input
                    type="text"
                    placeholder="Nhập địa chỉ cụ thể"
                    className="border p-2 rounded-md w-full mb-4"
                    value={street}
                    onChange={handleStreetChange}
                />
                {/* Thêm dropdown cho addressType */}
                <select
                    value={addressType}
                    onChange={handleAddressTypeChange}
                    className="border p-2 rounded-md w-full mb-4"
                >
                    {addressTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleSaveAddress}
                    className="bg-blue-500 text-white p-2 rounded-md w-full"
                >
                    Lưu địa chỉ
                </button>
            </div>
        </div>
    );
};

export default AddressFormModal;
