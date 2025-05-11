// src/store/slices/checkout/checkoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 0,
  addressList: [],
  selectedAddress: null,
  loading: false,
  error: null,
  paymentMethod: null,
  orderSummary: null
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    // Navigation
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step -= 1;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },

    // Address Management
    setAddressList: (state, action) => {
      state.addressList = action.payload;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    addAddress: (state, action) => {
      state.addressList.push(action.payload);
    },
    updateAddress: (state, action) => {
      const updatedAddress = action.payload;
      const index = state.addressList.findIndex(
        addr => addr.addressId === updatedAddress.addressId
      );
      if (index !== -1) {
        state.addressList[index] = updatedAddress;
      }
    },
    removeAddress: (state, action) => {
      const addressId = action.payload;
      state.addressList = state.addressList.filter(
        addr => addr.addressId !== addressId
      );
      if (state.selectedAddress?.addressId === addressId) {
        state.selectedAddress = null;
      }
    },

    // Loading and Error States
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Payment Method
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    // Order Summary
    setOrderSummary: (state, action) => {
      state.orderSummary = action.payload;
    },

    // Reset
    resetCheckout: (state) => {
      return initialState;
    },

    // Clear specific states
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    }
  }
});

// Action creators
export const {
  // Navigation
  nextStep,
  prevStep,
  setStep,
  
  // Address Management
  setAddressList,
  setSelectedAddress,
  addAddress,
  updateAddress,
  removeAddress,
  
  // Loading and Error States
  setLoading,
  setError,
  
  // Payment Method
  setPaymentMethod,
  
  // Order Summary
  setOrderSummary,
  
  // Reset and Clear
  resetCheckout,
  clearError,
  clearSelectedAddress
} = checkoutSlice.actions;

// Selectors
export const selectCheckoutStep = (state) => state.checkout.step;
export const selectAddressList = (state) => state.checkout.addressList;
export const selectSelectedAddress = (state) => state.checkout.selectedAddress;
export const selectLoading = (state) => state.checkout.loading;
export const selectError = (state) => state.checkout.error;
export const selectPaymentMethod = (state) => state.checkout.paymentMethod;
export const selectOrderSummary = (state) => state.checkout.orderSummary;

export default checkoutSlice.reducer;