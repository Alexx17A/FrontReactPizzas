// src/store/slices/checkout/checkoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeStep: 0,
  loading: false,
  error: null
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.activeStep += 1;
    },
    prevStep: (state) => {
      state.activeStep -= 1;
    },
    setStep: (state, action) => {
      state.activeStep = action.payload;
    },
    resetCheckout: (state) => {
      return initialState;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  nextStep,
  prevStep,
  setStep,
  resetCheckout,
  setLoading,
  setError
} = checkoutSlice.actions;

export default checkoutSlice.reducer;