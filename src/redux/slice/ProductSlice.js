import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";

const inititalState = {
    products: [],
    product: null
}

const getProductById = createAsyncThunk('product/getProductById', async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/v1/medicine/${id}`);        
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const ProductSlice = createSlice({
    name: 'product',
    initialState: inititalState,
    reducers: {

    },
    extraReducers: (builder) => {

        // getProductById
        builder.addCase(getProductById.pending, (state, action) => {
            state.product = null;
        });
        builder.addCase(getProductById.fulfilled, (state, action) => {
            state.product = action.payload.data;
            console.log(action.payload);            
        });
        builder.addCase(getProductById.rejected, (state, action) => {
            state.product = null;
        });
    }
});

export const { } = ProductSlice.actions;
export { getProductById };
export default ProductSlice.reducer;