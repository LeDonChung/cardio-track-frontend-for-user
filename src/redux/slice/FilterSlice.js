import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";

const inititalState = {
    filterCategories: [],
    filterBrands: [],
    filterObjects: [],
    search: {
        key: '',
        categories: [],
        brands: [],
        objects: [],
        priceFrom: 0, // từ 100
        priceTo: 100000, // đến 1000000\
    },
    pageData: {
        page: 0,
        size: 16,
        totalPage: 0,
        sortBy: 'price',
        sortName: 'ASC'
    },
    data: [],
}


const getCategoryByLevelFilter = createAsyncThunk('filter/getCategoryByLevelFilter', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/api/v1/category/get-by-level?level=3');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


const getBrandFilter = createAsyncThunk('filter/getBrandFilter', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/api/v1/brand/get-all');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const getTagByObjectFilter = createAsyncThunk('filter/getTagByObjectFilter', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/api/v1/tag/get-object');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


const searchData = createAsyncThunk('filter/searchData', async ({ page, size, sortBy, sortName, searchData }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/api/v1/medicine/search?page=${page}&size=${size}&sortBy=${sortBy}&sortName=${sortName}`, searchData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const FilterSlice = createSlice({
    name: 'filter',
    initialState: inititalState, 
    reducers: {
        setFilter: (state, action) => {
            state.search = action.payload;
        },
        setPageData: (state, action) => {
            state.pageData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCategoryByLevelFilter.pending, (state, action) => {
            state.filterCategories = [];
        });
        builder.addCase(getCategoryByLevelFilter.fulfilled, (state, action) => {
            state.filterCategories = action.payload.data;
        });
        builder.addCase(getCategoryByLevelFilter.rejected, (state, action) => {
            state.filterCategories = [];
        });


        builder.addCase(getBrandFilter.pending, (state, action) => {
            state.filterBrands = [];
        });
        builder.addCase(getBrandFilter.fulfilled, (state, action) => {
            state.filterBrands = action.payload.data;
        });
        builder.addCase(getBrandFilter.rejected, (state, action) => {
            state.filterBrands = [];
        });


        builder.addCase(getTagByObjectFilter.pending, (state, action) => {
            state.filterObjects = [];
        });
        builder.addCase(getTagByObjectFilter.fulfilled, (state, action) => {
            state.filterObjects = action.payload.data;
        });
        builder.addCase(getTagByObjectFilter.rejected, (state, action) => {
            state.filterObjects = [];
        });


        builder.addCase(searchData.pending, (state, action) => {

        });
        builder.addCase(searchData.fulfilled, (state, action) => {
            let res = action.payload.data;

            state.data = res.data;
            state.pageData = {
                page: res.page,
                size: res.size,
                sortBy: res.sortBy,
                sortName: res.sortName,
                totalPage: res.totalPage
            }
        });
        builder.addCase(searchData.rejected, (state, action) => {
        });
    }
})


export const { setFilter, setPageData, setIsOpenModalSearchByImage } = FilterSlice.actions;
export { getTagByObjectFilter, getBrandFilter, getCategoryByLevelFilter, searchData };
export default FilterSlice.reducer; 