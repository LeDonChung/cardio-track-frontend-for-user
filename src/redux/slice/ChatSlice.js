import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";
import axios from "axios";

const inititalState = {
    isChatOpen: false,
}

const ChatSlice = createSlice({
    name: 'chat',
    initialState: inititalState,
    reducers: {
        setIsChatOpen: (state, action) => {
            state.isChatOpen = action.payload;
        },
    },
    extraReducers: (builder) => {
        
    }
})


export const { setIsChatOpen } = ChatSlice.actions;
export { };
export default ChatSlice.reducer; 