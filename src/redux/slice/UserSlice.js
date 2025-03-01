import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";
import axios from "axios";


const inititalState = {
    errorResponse: null
}





const fetchUserInfo = createAsyncThunk('user/fetchUserInfo', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Không có token.");
        }

        const response = await axiosInstance.get(`/api/v1/user/info?token=${token}`);

        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi API không lấy được thông tin user.");
    }
});
//địa chỉ user
// ✅ Thunk để fetch danh sách địa chỉ của user
export const fetchUserAddresses = createAsyncThunk(
    "user/fetchUserAddresses",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/user/addresses/${userId}`);
            console.log("✅ Địa chỉ user:", response.data);
            return response.data.data; // Chỉ lấy `data` từ API
        } catch (error) {
            console.error("❌ Lỗi API fetchUserAddresses:", error.response?.data || error.message);
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
            // 
            console.log("Full: ", action.payload.data);
            localStorage.setItem("userInfo", JSON.stringify(action.payload.data));
            state.errorResponse = null;
        });
        builder.addCase(fetchUserInfo.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });
        
        

    }
})


export const { } = UserSlice.actions;
export { register, login, sendOtp, fetchUserInfo };
export default UserSlice.reducer;