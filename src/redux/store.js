import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slice/UserSlice';
import CategorySlice from './slice/CategorySlice';
import BrandSlice from './slice/BrandSlice';
import TagSlice from './slice/TagSlice';
import CartSlice from './slice/CartSlice';
import ProductSlice from './slice/ProductSlice';
import FilterSlice from './slice/FilterSlice';
import PostSlice from './slice/PostSlice';
import ChatSlice from './slice/ChatSlice';

const store = configureStore({
    reducer: {
        user: UserSlice,
        category: CategorySlice,
        brand: BrandSlice,
        tag: TagSlice,
        cart: CartSlice,
        product: ProductSlice,
        filter: FilterSlice,
        post: PostSlice,
        chat: ChatSlice
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;