import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slice/UserSlice';
import CategorySlice from './slice/CategorySlice';

const store = configureStore({
    reducer: {
        user: UserSlice,
        category: CategorySlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;