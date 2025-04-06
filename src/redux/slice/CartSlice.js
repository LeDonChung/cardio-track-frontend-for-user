import { createSlice } from '@reduxjs/toolkit';
import { fetchAddresses, submitOrder, addAddress } from '../../api/CartAPI';
import { createAsyncThunk } from '@reduxjs/toolkit';
import showToast from "../../utils/AppUtils";

const loadCartFromLocalStorage = () => {
  // Kiểm tra xem có userId trong localStorage không
  const userId = JSON.parse(localStorage.getItem('userInfo'))?.id;

  if (userId) {
    // Nếu có userId, lấy giỏ hàng của người dùng từ localStorage
    const cart = JSON.parse(localStorage.getItem(`cart_${userId}`));
    return cart || [];
  } else {
    // Nếu không có userId, lấy giỏ hàng chung của khách từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart_guest'));
    return cart || [];
  }
};

const saveCartToLocalStorage = (cart) => {
  const userId = JSON.parse(localStorage.getItem('userInfo'))?.id;
  if (userId) {
    // Nếu có userId, lưu giỏ hàng dưới key theo userId
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
  } else {
    // Nếu không có userId, lưu giỏ hàng chung cho khách
    localStorage.setItem('cart_guest', JSON.stringify(cart));
  }
};

// Thunk để thêm địa chỉ mới
export const addAddressThunk = createAsyncThunk(
  'cart/addAddress',
  async ({ addressData }, { rejectWithValue }) => {
    const userId = JSON.parse(localStorage.getItem('userInfo'))?.id;
    const token = localStorage.getItem('authToken');

    try {
      // Gọi API addAddress với addressData, userId và token
      const response = await addAddress(addressData, userId, token);
      if (response.status === 200) {
        showToast('Thêm địa chỉ thành công', 'success');  // Hiển thị thông báo thành công
      } else {
        showToast('Thêm địa chỉ thất bại', 'error');  // Hiển thị thông báo thất bại
      }
      return response.data;  // Trả về kết quả từ API
    } catch (error) {
      // Nếu có lỗi xảy ra, trả về thông báo lỗi
      showToast('Có lỗi xảy ra khi thêm địa chỉ', 'error');  // Hiển thị thông báo lỗi
      console.error('Error adding address:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  cart: loadCartFromLocalStorage(),  // Tải giỏ hàng từ LocalStorage nếu có
  addresses: [],
  loading: false,
  error: null,
  orderResponse: null,
  addressResponse: null,
};

// Thunk để lấy danh sách địa chỉ
export const fetchAddressesThunk = createAsyncThunk(
  'cart/fetchAddresses',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchAddresses(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk để gửi đơn hàng
export const submitOrderThunk = createAsyncThunk(
  'cart/submitOrder',
  async ({ orderData, token }, { rejectWithValue }) => {
    try {
      const response = await submitOrder(orderData, token);  // Gọi API để gửi đơn hàng
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
        existingProduct.quantity += product.quantity ? product.quantity : 1;
      } else {
        // Nếu chưa có trong giỏ, thêm sản phẩm mới vào giỏ
        state.cart.push({ ...product, quantity: product.quantity ? product.quantity : 1 });
      }
      saveCartToLocalStorage(state.cart);
    },

    // Xóa sản phẩm khỏi giỏ
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
      saveCartToLocalStorage(state.cart);
    },

    // Cập nhật số lượng sản phẩm trong giỏ
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.cart.find(item => item.id === id);
      if (product) {
        product.quantity = quantity;
      }
      saveCartToLocalStorage(state.cart);
    },

    // Cập nhật giỏ hàng
    updateCart: (state, action) => {
      state.cart = action.payload;
      saveCartToLocalStorage(state.cart);
    },

    // Xóa các sản phẩm đã chọn khỏi giỏ hàng
    clearSelectedProducts: (state) => {
      state.cart = state.cart.filter(product => !product.selected);
      saveCartToLocalStorage(state.cart);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAddressesThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAddressesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.addresses = action.payload;
    });
    builder.addCase(fetchAddressesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(submitOrderThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(submitOrderThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.orderResponse = action.payload;
    });
    builder.addCase(submitOrderThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(addAddressThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addAddressThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.addressResponse = action.payload;  // Lưu kết quả trả về khi thêm địa chỉ
    });
    builder.addCase(addAddressThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateCart, clearSelectedProducts } = cartSlice.actions;
export default cartSlice.reducer;