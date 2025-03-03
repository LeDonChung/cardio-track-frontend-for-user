import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";
import axios from "axios";

const inititalState = {
    categories: [],
    prominents: []
}

const getCategories = createAsyncThunk('category/getCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/api/v1/category/get-category-level1');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const getProminents = createAsyncThunk('category/getProminents', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/api/v1/category/get-prominent');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const getCategoriesByLevel = createAsyncThunk('category/getCategoriesByLevel', async (level, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/v1/category/get-by-level?level=${level}`);
        console.log(response.data.data);        
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

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


        builder.addCase(getProminents.pending, (state, action) => {
            state.prominents = [];
        });
        builder.addCase(getProminents.fulfilled, (state, action) => {
            state.prominents = action.payload.data;
        });
        builder.addCase(getProminents.rejected, (state, action) => {
            state.prominents = [];
        });

        builder.addCase(getCategoriesByLevel.pending, (state, action) => {
            state.categories = [];
        });
        builder.addCase(getCategoriesByLevel.fulfilled, (state, action) => {
            state.categories = action.payload.data;
        });
        builder.addCase(getCategoriesByLevel.rejected, (state, action) => {
            state.categories = [];
        });
    }
})


export const { } = CategorySlice.actions;
export { getCategories, getProminents, getCategoriesByLevel };
export default CategorySlice.reducer; 