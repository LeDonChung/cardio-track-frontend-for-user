import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],  // Giỏ hàng bắt đầu rỗng
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cart.find(item => item.id === product.id);
      
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên 1
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        // Nếu chưa có trong giỏ, thêm sản phẩm mới vào giỏ
        state.cart.push({ ...product, quantity: 1 });
      }
    },

    // Xóa sản phẩm khỏi giỏ
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },

    // Cập nhật số lượng sản phẩm trong giỏ
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.cart.find(item => item.id === id);
      if (product) {
        product.quantity = quantity;
      }
    },

    // Cập nhật giỏ hàng
    updateCart: (state, action) => {
      state.cart = action.payload
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateCart } = cartSlice.actions;
export default cartSlice.reducer;
