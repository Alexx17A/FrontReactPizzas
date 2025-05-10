// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import addressReducer from './slices/checkout/addressSlice';
import checkoutReducer from './slices/checkout/checkoutSlice';
import paymentReducer from './slices/checkout/paymentSlice';

export const store = configureStore({
  reducer: {
    address: addressReducer,
    checkout: checkoutReducer,
    payment: paymentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora acciones específicas si es necesario
        ignoredActions: [
          // 'payment/someAction'
        ],
        // Ignora paths específicos si es necesario
        ignoredPaths: [
          // 'payment.someField'
        ],
      },
    }),
});

export default store;