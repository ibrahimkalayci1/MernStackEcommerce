import { createSlice } from '@reduxjs/toolkit';

const fetchFromLocalStorage = () => {
  let cart = localStorage.getItem('cart');
  if (cart) {
    return JSON.parse(localStorage.getItem('cart'));
  } else {
    return [];
  }
};

const storeInLocalSrorage = (data) => {
  localStorage.setItem('cart', JSON.stringify(data));
};

const initialState = {
  carts: fetchFromLocalStorage(),
};

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    addToCard: (state, action) => {
      const isItemCart = state.carts.find((cart) => cart.id == action.payload.id);

      if (isItemCart) {
        state.carts = state.carts.map((item) => {
          if (item.id == action.payload.id) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity,
            };
          }
          return item;
        });
      } else {
        state.carts.push(action.payload);
      }

      storeInLocalSrorage(state.carts);
    },

    removeFromCart: (state, action) => {
      state.carts = state.carts.filter((item) => item.id != action.payload);
      storeInLocalSrorage(state.carts);
    },

    clearCart: (state) => {
      state.carts = [];
      storeInLocalSrorage(state.carts);
    },
  },
});

export const { addToCard, removeFromCart, clearCart } = generalSlice.actions;

export default generalSlice.reducer;
