import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";


const initialState = {
    errorResponse: null,
    healthTests: [],
    submitResult: null,
  
};

// Lấy tất cả các bài test sức khỏe
const fetchAllHealthTests = createAsyncThunk("healthcheck/fetchAllHealthTests", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/api/v1/healthcheck/all");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi lấy danh sách bài kiểm tra sức khỏe.");
    }
});

// Gửi câu trả lời của người dùng
const submitUserAnswers = createAsyncThunk("healthcheck/submitUserAnswers", async (answers, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/api/v1/healthcheck/submit-answers", answers);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gửi câu trả lời.");
    }
});

// Tạo bài kiểm tra sức khỏe mới
const createHealthCheck = createAsyncThunk("healthcheck/createHealthCheck", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/api/v1/healthcheck/create", data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi tạo bài kiểm tra sức khỏe.");
    }
});

// Fetch bài test theo ID
// Lấy bài test theo ID
const fetchHealthTestById = createAsyncThunk("healthcheck/fetchById", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/v1/healthcheck/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Không thể lấy thông tin bài test.");
    }
});

  

const HealthCheckSlice = createSlice({
    name: 'healthcheck',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
       
            builder
                .addCase(fetchAllHealthTests.pending, (state) => {
                    state.errorResponse = null;
                })
                .addCase(fetchAllHealthTests.fulfilled, (state, action) => {
                    state.healthTests = action.payload;
                })
                .addCase(fetchAllHealthTests.rejected, (state, action) => {
                    state.errorResponse = action.payload;
                })
                .addCase(submitUserAnswers.pending, (state) => {
                    state.errorResponse = null;
                })
                .addCase(submitUserAnswers.fulfilled, (state, action) => {
                    state.submitResult = action.payload;
                })
                .addCase(submitUserAnswers.rejected, (state, action) => {
                    state.errorResponse = action.payload;
                })
                .addCase(createHealthCheck.pending, (state) => {
                    state.errorResponse = null;
                })
                .addCase(createHealthCheck.fulfilled, (state, action) => {
                    state.healthTests.push(action.payload);
                })
                .addCase(createHealthCheck.rejected, (state, action) => {
                    state.errorResponse = action.payload;
                })
                .addCase(fetchHealthTestById.pending, (state) => {
                    state.errorResponse = null;
                })
                .addCase(fetchHealthTestById.fulfilled, (state, action) => {
                    // Kiểm tra nếu test chưa có thì thêm vào mảng
                    const exists = state.healthTests.some(t => t.id === action.payload.id);
                    if (!exists) {
                      state.healthTests.push(action.payload);
                    }
                  })
                .addCase(fetchHealthTestById.rejected, (state, action) => {
                    state.errorResponse = action.payload;
                });
                
    },

    });


    export const {} = HealthCheckSlice.actions;
    export { fetchAllHealthTests, submitUserAnswers, createHealthCheck,fetchHealthTestById };
    export default HealthCheckSlice.reducer;
    