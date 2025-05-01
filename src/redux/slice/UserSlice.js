import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";
import axios from "axios";

const initialState = {
    userAddresses: [],
    orders: [],
    errorResponse: null
};

const fetchUserInfo = createAsyncThunk('user/fetchUserInfo', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(`/api/v1/user/info?token=${token}`);
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi API không lấy được thông tin user.");
    }
});

// get danh sách địa chỉ của user
const fetchUserAddresses = createAsyncThunk(
    "user/fetchUserAddresses",
    async (_, { rejectWithValue }) => {
        try {
            // Lấy thông tin user từ localStorage
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            // Sử dụng userId để lấy danh sách địa chỉ của người dùng
            const response = await axiosInstance.get(`/api/v1/address/get-by-user-id/${userInfo.id}`);
            return response.data; // Trả về danh sách địa chỉ
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi API không lấy được danh sách địa chỉ.");
        }
    }
);

// hàm update user
const updateUserInfo = createAsyncThunk(
    'user/updateUserInfo',
    async (userData, { rejectWithValue }) => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const response = await axiosInstance.put(`/api/v1/user/update-user/${userInfo.id}`, userData);
        return response.data; // Trả về dữ liệu cập nhật thành công
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi cập nhật thông tin người dùng.");
      }
    }
);

// Thêm địa chỉ cho người dùng
const addAddress = createAsyncThunk(
    'user/addAddress',
    async (addressData, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('/api/v1/address/add-address', addressData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi thêm địa chỉ.");
      }
    }
);

// Cập nhật địa chỉ của người dùng
const updateAddress = createAsyncThunk(
    'user/updateAddress',
    async (addressData, { rejectWithValue }) => {
      try {
        // Lấy ID của địa chỉ cần sửa từ addressData
        const addressId = addressData.id; // Đảm bảo rằng id có trong addressData
        if (!addressId) {
          return rejectWithValue("ID địa chỉ không hợp lệ.");
        }
  
        // Gọi API cập nhật địa chỉ
        const response = await axiosInstance.put(`/api/v1/address/update-address/${addressId}`, addressData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi cập nhật địa chỉ.");
      }
    }
  );

  // hàm xoa địa chỉ
const deleteAddress = createAsyncThunk(
    'user/deleteAddress',
    async (addressData, { rejectWithValue }) => {
      try {
        // Gọi API xóa địa chỉ
        const addressId = addressData.id;
        const response = await axiosInstance.delete(`/api/v1/address/delete-address/${addressId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi xóa địa chỉ.");
      }
    }
  );

const register = createAsyncThunk('user/register', async (request, { rejectWithValue }) => {
    try {
        console.log("request", request)
        const response = await axiosInstance.post('/api/v1/auth/register', request);
        
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const login = createAsyncThunk('user/login', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/v1/auth/login', request);
        return response.data;
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API đăng nhập.");
    }
});

const sendOtp = createAsyncThunk('user/sendOtp', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/v1/auth/generation-otp?phoneNumber=' + request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//lấy danh sách đơn đặt hàng của user 
const fetchUserOrders = createAsyncThunk('user/fetchUserOrders', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // Sử dụng userInfo.id để lấy danh sách đơn hàng
        const response = await axiosInstance.get(`/api/v1/order/user/${userInfo.id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Cung cấp token trong header
            }
        });
        return response.data; // Trả về dữ liệu đơn hàng của người dùng
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi API không lấy được thông tin đơn hàng.");
    }
});



const UserSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        // register
        builder.addCase(register.pending, (state, action) => {
            state.errorResponse = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.errorResponse = null;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });

        // login
        builder.addCase(login.pending, (state, action) => {
            state.errorResponse = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            localStorage.setItem('token', action.payload.data);
            state.errorResponse = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });

        // sendOtp
        builder.addCase(sendOtp.pending, (state, action) => {
            state.errorResponse = null;
        });
        builder.addCase(sendOtp.fulfilled, (state, action) => {
            state.errorResponse = null;
        });
        builder.addCase(sendOtp.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });

        // fetchUserInfo
        builder.addCase(fetchUserInfo.pending, (state) => {
            state.errorResponse = null;
        });
        builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
            localStorage.setItem("userInfo", JSON.stringify(action.payload.data));
            state.errorResponse = null;
        });
        builder.addCase(fetchUserInfo.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });

        // fetchUserAddresses
        builder.addCase(fetchUserAddresses.pending, (state) => {
            state.errorResponse = null;
        });
        builder.addCase(fetchUserAddresses.fulfilled, (state, action) => {
            state.userAddresses = action.payload.data; // Cập nhật danh sách địa chỉ vào Redux store
            localStorage.setItem("userAddress", JSON.stringify(action.payload.data));
            state.errorResponse = null;
        });
        builder.addCase(fetchUserAddresses.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });

        // update user
        builder.addCase(updateUserInfo.pending, (state) => {
            state.errorResponse = null;
        });
        builder.addCase(updateUserInfo.fulfilled, (state, action) => {
            state.errorResponse = null;
        });
        builder.addCase(updateUserInfo.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });

        // update address
        builder.addCase(updateAddress.pending, (state) => {
            state.errorResponse = null;
        });
        builder.addCase(updateAddress.fulfilled, (state, action) => {
            state.errorResponse = null;
        });
        builder.addCase(updateAddress.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });

        // add address
        builder.addCase(addAddress.pending, (state) => {
            state.errorResponse = null;
        });
        builder.addCase(addAddress.fulfilled, (state, action) => {
            state.errorResponse = null;
        });
        builder.addCase(addAddress.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });

        // delete address
        builder.addCase(deleteAddress.pending, (state) => {
            state.errorResponse = null;
        });
    // delete address
        builder.addCase(deleteAddress.fulfilled, (state, action) => {
         state.errorResponse = null;
            // Lọc lại danh sách địa chỉ sau khi xóa
        const deletedAddressId = action.payload.data.id; // Lấy id của địa chỉ đã xóa
         state.userAddresses = state.userAddresses.filter(address => address.id !== deletedAddressId);
        });
        builder.addCase(deleteAddress.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });
        //My orders
        builder.addCase(fetchUserOrders.pending, (state) => {
            state.errorResponse = null;
        });
        builder.addCase(fetchUserOrders.fulfilled, (state, action) => {
            state.userAddresses = action.payload.data; // Cập nhật danh sách địa chỉ vào Redux store
            state.orders = action.payload.data;
            localStorage.setItem("MyOrder", JSON.stringify(action.payload.data));
            state.errorResponse = null;
        });
        builder.addCase(fetchUserOrders.rejected, (state, action) => {
            state.errorResponse = action.payload; // Xử lý lỗi khi gọi API thất bại
        });
        

    }
});

export const { } = UserSlice.actions;
export { register, login, sendOtp, fetchUserInfo, fetchUserAddresses, updateUserInfo, addAddress, updateAddress,deleteAddress,fetchUserOrders };
export default UserSlice.reducer;