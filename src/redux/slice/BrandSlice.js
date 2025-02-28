import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";
import axios from "axios";

const inititalState = {
    brands: []
}

const getBrands = createAsyncThunk('brand/getBrands', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/api/v1/brand');
        return response.data; 
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const BrandSlice = createSlice({
    name: 'brand',
    initialState: inititalState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getBrands.pending, (state, action) => {
            state.brands = [];
        });
        builder.addCase(getBrands.fulfilled, (state, action) => {
            state.brands = action.payload.data.data;
        });
        builder.addCase(getBrands.rejected, (state, action) => {
            state.brands = [];
        });
    }
})


export const { } = BrandSlice.actions;
export { getBrands };
export default BrandSlice.reducer;