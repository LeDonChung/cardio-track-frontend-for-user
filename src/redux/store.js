import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slice/UserSlice';
import CategorySlice from './slice/CategorySlice';
import BrandSlice from './slice/BrandSlice';

const store = configureStore({
    reducer: {
        user: UserSlice,
        category: CategorySlice,
        brand: BrandSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;