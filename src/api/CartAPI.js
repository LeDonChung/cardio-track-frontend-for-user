import { axiosInstance } from "./APIClient";

// Lấy danh sách địa chỉ lưu trữ của user
export const fetchAddresses = (userId) => {
    return axiosInstance.get(`/api/v1/address/${userId}`);
};

// Gửi yêu cầu đặt hàng
export const submitOrder = (orderData, token) => {
    return axiosInstance.post('/api/v1/order', orderData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};
