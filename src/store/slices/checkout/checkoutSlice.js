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

// Solo recuperamos clientSecret y orderSummary de localStorage
const loadInitialState = () => {
  try {
    // Intentar cargar el client secret
    const persistedClientSecret = localStorage.getItem('client-secret');
    let clientSecret = null;
    if (persistedClientSecret) {
      const parsed = JSON.parse(persistedClientSecret);
      clientSecret = parsed.client_secret;
    }

    // Intentar cargar el orderSummary (carrito)
    const persistedOrderSummary = localStorage.getItem('order-summary');
    let orderSummary = null;
    if (persistedOrderSummary) {
      orderSummary = JSON.parse(persistedOrderSummary);
    }

    // Retornar el estado inicial con los valores cargados
    return { 
      ...defaultInitialState,
      clientSecret: clientSecret,
      orderSummary: orderSummary
    };
  } catch (error) {
    console.error('Error loading persisted state:', error);
    return { ...defaultInitialState };
  }
};

const initialState = loadInitialState();

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
    clearError: (state) => {
      state.error = null;
    },

    // Payment Method
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    // Order Summary
    setOrderSummary: (state, action) => {
      state.orderSummary = action.payload;
      // Solo guardamos el orderSummary en localStorage
      localStorage.setItem('order-summary', JSON.stringify(action.payload));
    },

    // Client Secret
    setClientSecret: (state, action) => {
      state.clientSecret = action.payload;
      // Solo guardamos el client secret en localStorage
      if (action.payload) {
        localStorage.setItem('client-secret', JSON.stringify({ client_secret: action.payload }));
      } else {
        localStorage.removeItem('client-secret');
      }
    },

    // Clear States
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },

    // Reset Checkout
    resetCheckout: () => {
      // Eliminamos solo el client-secret y order-summary de localStorage
      localStorage.removeItem('client-secret');
      localStorage.removeItem('order-summary');
      return { ...defaultInitialState }; // Siempre limpio
    },

    // Persistir solo los datos necesarios
    persistState: () => {
      // Este método no hace nada ahora porque los datos se guardan directamente
      // en los métodos setClientSecret y setOrderSummary
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
  // Primero verificar si está en el estado de Redux
  const reduxSecret = state.checkout.clientSecret;
  if (reduxSecret) return reduxSecret;

  // Si no está en Redux, intentar recuperarlo de localStorage
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