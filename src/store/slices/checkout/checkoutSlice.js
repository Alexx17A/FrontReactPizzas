// src/store/slices/checkout/checkoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const defaultInitialState = {
  step: 0,
  addressList: [],
  selectedAddress: null,
  loading: false,
  error: null,
  paymentMethod: null,
  orderSummary: null,
  clientSecret: null
};

const loadInitialState = () => {
  try {
    const persistedState = localStorage.getItem('checkout-state');
    if (persistedState) {
      return JSON.parse(persistedState);
    }
  } catch (error) {
    console.error('Error loading checkout state:', error);
  }
  return { ...defaultInitialState };
};

const initialState = loadInitialState();

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    // Navigation
    nextStep: (state) => {
      state.step += 1;
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },
    prevStep: (state) => {
      state.step -= 1;
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },
    setStep: (state, action) => {
      state.step = action.payload;
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },

    // Address Management
    setAddressList: (state, action) => {
      state.addressList = action.payload;
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },
    addAddress: (state, action) => {
      state.addressList.push(action.payload);
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },
    updateAddress: (state, action) => {
      const updatedAddress = action.payload;
      const index = state.addressList.findIndex(
        addr => addr.addressId === updatedAddress.addressId
      );
      if (index !== -1) {
        state.addressList[index] = updatedAddress;
      }
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },
    removeAddress: (state, action) => {
      const addressId = action.payload;
      state.addressList = state.addressList.filter(
        addr => addr.addressId !== addressId
      );
      if (state.selectedAddress?.addressId === addressId) {
        state.selectedAddress = null;
      }
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },

    // Loading and Error States
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Payment Method
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },

    // Order Summary
    setOrderSummary: (state, action) => {
      state.orderSummary = action.payload;
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },

    // Client Secret
    setClientSecret: (state, action) => {
      state.clientSecret = action.payload;
      localStorage.setItem('client-secret', JSON.stringify({ client_secret: action.payload }));
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },

    // Clear States
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
      localStorage.setItem('checkout-state', JSON.stringify(state));
    },

    // Reset Checkout (usado en lugar de clearPersistedState)
    resetCheckout: () => {
      localStorage.removeItem('checkout-state');
      localStorage.removeItem('client-secret');
      return { ...defaultInitialState }; // SIEMPRE limpio
    },

    // Persistir Estado
    persistState: (state) => {
      const stateToStore = {
        ...state,
        loading: false,
        error: null
      };
      localStorage.setItem('checkout-state', JSON.stringify(stateToStore));
    }
  }
});

// Action creators
export const {
  nextStep,
  prevStep,
  setStep,
  setAddressList,
  setSelectedAddress,
  addAddress,
  updateAddress,
  removeAddress,
  setLoading,
  setError,
  clearError,
  setPaymentMethod,
  setOrderSummary,
  setClientSecret,
  clearSelectedAddress,
  resetCheckout,
  persistState
} = checkoutSlice.actions;

// Selectors
export const selectCheckoutStep = (state) => state.checkout.step;
export const selectAddressList = (state) => state.checkout.addressList;
export const selectSelectedAddress = (state) => state.checkout.selectedAddress;
export const selectLoading = (state) => state.checkout.loading;
export const selectError = (state) => state.checkout.error;
export const selectPaymentMethod = (state) => state.checkout.paymentMethod;
export const selectOrderSummary = (state) => state.checkout.orderSummary;
export const selectClientSecret = (state) => {
  const reduxSecret = state.checkout.clientSecret;
  if (reduxSecret) return reduxSecret;

  try {
    const localStorageSecret = localStorage.getItem('client-secret');
    if (localStorageSecret) {
      const parsed = JSON.parse(localStorageSecret);
      return parsed.client_secret;
    }
  } catch (error) {
    console.error('Error reading client secret from localStorage:', error);
  }
  return null;
};

export default checkoutSlice.reducer;