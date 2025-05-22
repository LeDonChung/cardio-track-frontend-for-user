import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from "../utils/AppUtils";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const PaymentResult = () => {
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState('');
    const [orderId, setOrderId] = useState('');
    const token = localStorage.getItem('token');
    const isProcessed = useRef(false); 

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const orderCode = urlParams.get('orderCode');
        setOrderId(orderCode);
        setPaymentStatus(status);
    
        if (!isProcessed.current) {
            if (status === 'PAID') {
                handlePaymentSuccess(orderCode);
            } else if (status === 'CANCELLED') {
                handlePaymentCancel(orderCode);
            } else {
                showToast("Trạng thái thanh toán không hợp lệ", "error");
            }
            isProcessed.current = true; 
        }
    }, [navigate]); 
    
    const handlePaymentSuccess = async(orderCode) => {
        try{
            const changeStatusResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/order/change-status/${orderCode}?status=PAID`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        }
        catch (error) {
            console.log(error);
        }
        showToast("Thanh toán thành công", "success");
    };
    
    const handlePaymentCancel = async(orderCode) => {
        try {
            const changeStatusResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/order/change-status/${orderCode}?status=CANCELLED`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.log(error);
        }
        showToast("Thanh toán bị hủy", "error");
    };    

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Kết quả thanh toán</h1>
                <div className="text-center mb-6">
                    {paymentStatus === 'PAID' ? (
                        <div className="text-green-600 flex items-center justify-center">
                            <FaCheckCircle size={48} className="mr-2" />
                            <p className="text-xl font-medium">Đơn hàng thanh toán thành công!</p>
                        </div>
                    ) : paymentStatus === 'CANCELLED' ? (
                        <div className="text-red-600 flex items-center justify-center">
                            <FaTimesCircle size={48} className="mr-2" />
                            <p className="text-xl font-medium">Đơn hàng đã bị hủy!</p>
                        </div>
                    ) : (
                        <p className="text-lg text-gray-700">Trạng thái thanh toán không hợp lệ</p>
                    )}
                </div>
                <div className="flex justify-center">
                    <button 
                        onClick={handleGoHome} 
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};