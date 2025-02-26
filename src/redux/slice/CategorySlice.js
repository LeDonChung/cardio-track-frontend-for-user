import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";
import axios from "axios";

const inititalState = {
    categories: []
}

const getCategories = createAsyncThunk('category/getCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/api/v1/category/get-category-level1');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const CategorySlice = createSlice({
    name: 'category',
    initialState: inititalState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getCategories.pending, (state, action) => {
            state.categories = [];
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data;
        });
        builder.addCase(getCategories.rejected, (state, action) => {
            state.categories = [];
        });
    }
})


export const { } = CategorySlice.actions;
export { getCategories };
export default CategorySlice.reducer;