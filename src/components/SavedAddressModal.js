import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAddressesThunk } from '../redux/slice/CartSlice';
import { Edit, Trash } from 'lucide-react';

const SavedAddressModal = ({ isOpen, onClose, onSelect, openAddressFormModal }) => {
    const dispatch = useDispatch();
    const [addresses, setAddresses] = useState([]);
    const [user, setUser] = useState(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        return user;
    });

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
                                                alert('Chưa làm từ từ');
                                            }} 
                                            className="p-2 rounded-md text-sm text-yellow-600 hover:text-yellow-800 transition-all"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering onSelect
                                                alert('Chưa làm từ từ');
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
        </div>
    );
};

export default SavedAddressModal;