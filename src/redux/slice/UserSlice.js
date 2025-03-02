import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";
import axios from "axios";


const inititalState = {
    userAddresses: [],
    errorResponse: null
}





const fetchUserInfo = createAsyncThunk('user/fetchUserInfo', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(`/api/v1/user/info?token=${token}`);
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi API không lấy được thông tin user.");
    }
});

// getdanh sách địa chỉ của user
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







const register = createAsyncThunk('user/register', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/v1/auth/register', request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


const login = createAsyncThunk('user/login', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/v1/auth/login', request);
        return response.data;
    } catch (error) {
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
})


const UserSlice = createSlice({
    name: 'user',
    initialState: inititalState,
    reducers: {

    },
    extraReducers: (builder) => {
        // register
        builder.addCase(register.pending, (state, action) => {
            state.errorResponse = null;
        })
        builder.addCase(register.fulfilled, (state, action) => {
            state.errorResponse = null;
        })
        builder.addCase(register.rejected, (state, action) => {
            state.errorResponse = action.payload;
        })

        // login
        builder.addCase(login.pending, (state, action) => {
            state.errorResponse = null;
        })
        builder.addCase(login.fulfilled, (state, action) => {
            localStorage.setItem('token', action.payload.data);
            state.errorResponse = null;
        })
        builder.addCase(login.rejected, (state, action) => {
            state.errorResponse = action.payload;
        })

        // sendOtp
        builder.addCase(sendOtp.pending, (state, action) => {
            state.errorResponse = null;
        })
        builder.addCase(sendOtp.fulfilled, (state, action) => {
            state.errorResponse = null;
        })
        builder.addCase(sendOtp.rejected, (state, action) => {
            state.errorResponse = action.payload;
        })

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
            console.log(action.payload)

        });
        

    }
})


export const { } = UserSlice.actions;
export { register, login, sendOtp, fetchUserInfo, fetchUserAddresses };
export default UserSlice.reducer;