import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";
import axios from "axios";

const inititalState = {
    tagsByObject: []
}

const getObject = createAsyncThunk('tag/getObject', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/api/v1/tag/get-object');
        return response.data; 
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const TagSlice = createSlice({
    name: 'tag',
    initialState: inititalState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getObject.pending, (state, action) => {
            state.tagsByObject = [];
        });
        builder.addCase(getObject.fulfilled, (state, action) => {
            state.tagsByObject = action.payload.data;
        });
        builder.addCase(getObject.rejected, (state, action) => {
            state.tagsByObject = [];
        });
    }
})


export const { } = TagSlice.actions;
export { getObject };
export default TagSlice.reducer;