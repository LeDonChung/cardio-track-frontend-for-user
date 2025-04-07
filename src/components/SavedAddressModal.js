import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAddressesThunk, deleteAddressThunk } from '../redux/slice/CartSlice';
import { Edit, Trash } from 'lucide-react';
import showToast from '../utils/AppUtils';

const SavedAddressModal = ({ isOpen, onClose, onSelect, openAddressFormModal }) => {
    const dispatch = useDispatch();
    const [addresses, setAddresses] = useState([]);
    const [user, setUser] = useState(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        return user;
    });

    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchAddressesThunk(user.id))
            .then(response => {
                if (response.payload && response.payload.data) {
                    setAddresses(response.payload.data);
                } else {
                    console.log('Không có địa chỉ nào được trả về từ API');
                }
            })
    }, [dispatch, user.id, isOpen]);
        
    if (!isOpen) return null;

    const handleAddNewAddress = () => {
        openAddressFormModal();
    };

    const handleDeleteAddress = (addressId) => {
        setAddressToDelete(addressId); // Lưu địa chỉ cần xóa
        setDeleteConfirmOpen(true); // Mở modal xác nhận
    };

    const handleConfirmDelete = () => {
        dispatch(deleteAddressThunk({ addressId: addressToDelete }))
            .then(response => {
                if (response.payload && response.payload.success) {
                    setAddresses(prevAddresses => prevAddresses.filter(address => address.id !== addressToDelete));
                } else {
                    console.log('Xóa địa chỉ thất bại', response.payload);
                }
            })
            .catch(error => {
                console.log('Có lỗi xảy ra khi xóa địa chỉ:', error);
            })
            .finally(() => setDeleteConfirmOpen(false)); // Đóng modal sau khi xử lý
    };

    const handleCancelDelete = () => {
        setDeleteConfirmOpen(false); // Đóng modal mà không xóa
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg overflow-auto max-h-[90vh] min-w-[600px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-center flex-grow">Địa chỉ đã lưu</h3>
                    <button 
                        onClick={onClose} 
                        className="text-3xl text-gray-600 hover:text-gray-800"
                    >
                        <span>&times;</span>
                    </button>
                </div>
                <div className="mt-4 space-y-4">
                    {addresses.length > 0 ? (
                        addresses.map((address) => (
                            <div 
                                key={address.id} 
                                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-all" 
                                onClick={() => onSelect(address)}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <p 
                                        className="font-semibold text-lg cursor-pointer text-blue-600 hover:text-blue-800"
                                    >
                                        {address.addressType}
                                    </p>
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering onSelect
                                                showToast('Chức năng chỉnh sửa chưa được triển khai', 'info');
                                            }} 
                                            className="p-2 rounded-md text-sm text-yellow-600 hover:text-yellow-800 transition-all"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering onSelect
                                                handleDeleteAddress(address.id);
                                            }}
                                            className="p-2 rounded-md text-sm text-red-600 hover:text-red-800 transition-all"
                                        >
                                            <Trash size={20} />
                                        </button>
                                    </div>
                                </div>
                                <p><strong>Người nhận: </strong>{address.fullName}</p>
                                <p><strong>Số điện thoại: </strong>{address.phoneNumber}</p>
                                <p><strong>Địa chỉ nhận: </strong>{address.street}, {address.ward}, {address.district}, {address.province}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Không có địa chỉ đã lưu.</p>
                    )}
                    {/* Nút Thêm Địa Chỉ Mới */}
                    <div className="mt-4 text-center">
                        <button 
                            onClick={handleAddNewAddress} 
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                        >
                            Thêm địa chỉ mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal xác nhận xóa */}
            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h3 className="text-xl font-bold text-center mb-4">Xác nhận xóa địa chỉ</h3>
                        <p className="text-center mb-4">Bạn có chắc chắn muốn xóa địa chỉ này?</p>
                        <div className="flex justify-center space-x-4">
                            <button 
                                onClick={handleConfirmDelete} 
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                            >
                                Xóa
                            </button>
                            <button 
                                onClick={handleCancelDelete} 
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedAddressModal;