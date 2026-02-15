import { configureStore } from '@reduxjs/toolkit';
import productSlice from './productSlice';
import generalReducer from './generalSlice'; // 👈 default import
import userSlice from './userSlice'; // 👈 default import
import cartSlice from './cartSlice';

export const store = configureStore({
  reducer: {
    products: productSlice,
    general: generalReducer,
    user: userSlice,
    cart: cartSlice,
  },
});
