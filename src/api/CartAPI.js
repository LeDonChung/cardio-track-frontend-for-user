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

// Thêm địa chỉ mới
export const addAddress = (addressData, userId, token) => {
    return axiosInstance.post(
      '/api/v1/user/address',
      { ...addressData, userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
};

export const updateAddress = (addressId, addressData, token) => {
    return axiosInstance.put(
      `/api/v1/address/update-address/${addressId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
}

export const deleteAddress = (addressId, token) => {
    return axiosInstance.delete(
      `/api/v1/address/delete-address/${addressId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
}   