import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";
import axios from "axios";

const initialState = {
    errorResponse: null,
    myPosts: [],
    comments: [],

};

const fetchCreatePost = createAsyncThunk('post/fetchCreatePost', async ({ title, content }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.post(`/api/v1/post/create`,{
            title,
            content
        }, {
            headers: {
                Authorization: `${token}` // Cung cấp token trong header
            }
        });
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi API không lấy được thông tin user.");
    }
});

//my list post 
    const fetchMyListPost = createAsyncThunk('post/fetchMyListPost', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const response = await axiosInstance.get(`/api/v1/post/my-post/${userInfo.id}`,{
            headers: {
                Authorization: `${token}` // Cung cấp token trong header
            }
        });
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi API không lấy được thông tin user.");
    }
});

    // Define the update post async thunk
 const fetchUpdatePost = createAsyncThunk('post/fetchUpdatePost', async ({ id, title, content }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.put(`/api/v1/post/update/${id}`, {
            title,
            content
        }, {
            headers: {
                Authorization: `${token}` // Add the token if necessary
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi cập nhật bài viết.");
    }
});

//All posts
const fetchAllListPost = createAsyncThunk('post/fetchAllListPost', async (_, { rejectWithValue }) => {
    try {
    
        const response = await axiosInstance.get(`/api/v1/post/all-post`);
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi API không lấy được post.");
    }
});


// Fetch bình luận của bài viết
const fetchComments = createAsyncThunk('comment/fetchComments', async (postId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/v1/comment/get-comments/${postId}`);
        return response.data; // Trả về dữ liệu bình luận
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi lấy danh sách bình luận.");
    }
});

// Thêm bình luận
const addComment = createAsyncThunk('comment/addComment', async (commentData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/v1/comment/create', commentData);
        return response.data; // Trả về bình luận vừa thêm
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi thêm bình luận.");
    }
});


const PostSlice = createSlice({
    name: 'post',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
       //tạo post cho user
        builder.addCase(fetchCreatePost.pending, (state, action) => {
        state.errorResponse = null;
        });
        builder.addCase(fetchCreatePost.fulfilled, (state, action) => {
            state.errorResponse = null;
        });
        builder.addCase(fetchCreatePost.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });
        //my list post
        builder.addCase(fetchMyListPost.pending, (state, action) => {
        state.errorResponse = null;
        });
        builder.addCase(fetchMyListPost.fulfilled, (state, action) => {
            state.errorResponse = null;
            state.myPosts = action.payload.data;
        });
        builder.addCase(fetchMyListPost.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });

        //update post
        builder.addCase(fetchUpdatePost.pending, (state, action) => {
        state.errorResponse = null;
        } );
        builder.addCase(fetchUpdatePost.fulfilled, (state, action) => {
            state.errorResponse = null;
        });
        builder.addCase(fetchUpdatePost.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });
        //lấy toàn bộ posts
        builder.addCase(fetchAllListPost.pending, (state, action) => {
        state.errorResponse = null;
        } );
        builder.addCase(fetchAllListPost.fulfilled, (state, action) => {
            state.errorResponse = null;
            state.myPosts = action.payload.data;
        });
        builder.addCase(fetchAllListPost.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });


        // Lấy bình luận
        builder.addCase(fetchComments.pending, (state) => {
            state.errorResponse = null;
        });
        builder.addCase(fetchComments.fulfilled, (state, action) => {
            state.comments = action.payload.data; // Cập nhật danh sách bình luận
        });
        builder.addCase(fetchComments.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });

        // Thêm bình luận
        builder.addCase(addComment.pending, (state) => {
            state.errorResponse = null;
        });
        builder.addCase(addComment.fulfilled, (state, action) => {
            state.comments.push(action.payload); // Thêm bình luận mới vào danh sách
        });
        builder.addCase(addComment.rejected, (state, action) => {
            state.errorResponse = action.payload;
        });
        


        

    }
});

export const { } = PostSlice.actions;
export { fetchCreatePost, fetchMyListPost,fetchUpdatePost,fetchAllListPost, fetchComments, addComment };
export default PostSlice.reducer;