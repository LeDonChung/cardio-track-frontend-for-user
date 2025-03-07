import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";

const inititalState = {
    products: [],
    product: null,
    recommendProducts: [],
    recommendOrders: []
}

const getProductById = createAsyncThunk('product/getProductById', async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/v1/medicine/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


const recommendProduct = createAsyncThunk('product/recommendProduct', async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/api/v1/recommend/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


const recommendOrder = createAsyncThunk('product/recommendOrder', async (ids, { rejectWithValue }) => {
    try {
        const params = new URLSearchParams();
        ids.forEach(id => {
            params.append('product_ids', id); // Thêm từng id mà không có dấu ngoặc vuông
        });

        const response = await axiosInstance.get(`/api/v1/recommend/order`, {
            params
        });
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

        // recommendProduct
        builder.addCase(recommendProduct.pending, (state, action) => {
            state.recommendProducts = [];
        });
        builder.addCase(recommendProduct.fulfilled, (state, action) => {
            state.recommendProducts = action.payload.data;
        });
        builder.addCase(recommendProduct.rejected, (state, action) => {
            state.recommendProducts = [];
        });


        // recommendOrder
        builder.addCase(recommendOrder.pending, (state, action) => {
            state.recommendOrders = [];
        });
        builder.addCase(recommendOrder.fulfilled, (state, action) => {
            state.recommendOrders = action.payload.data;
        });
        builder.addCase(recommendOrder.rejected, (state, action) => {
            state.recommendOrders = [];
        });
    }
});

export const { } = ProductSlice.actions;
export { getProductById, recommendProduct, recommendOrder };
export default ProductSlice.reducer;