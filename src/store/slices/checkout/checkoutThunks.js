// src/store/slices/checkout/checkoutThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api';
import { 
  setAddressList, 
  setLoading, 
  setError,
  setSelectedAddress,
  addAddress as addAddressAction,
  updateAddress as updateAddressAction,
  removeAddress as removeAddressAction
} from './checkoutSlice';

// GET /addresses
export const fetchAddresses = createAsyncThunk(
  'checkout/fetchAddresses',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null)); // Limpiar errores anteriores
      
      const response = await api.get('/addresses');
      dispatch(setAddressList(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cargar las direcciones';
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// POST /addresses
export const createAddress = createAsyncThunk(
  'checkout/createAddress',
  async (addressData, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.post('/addresses', addressData);
      const newAddress = response.data;
      
      dispatch(addAddressAction(newAddress));
      dispatch(setSelectedAddress(newAddress)); // Seleccionar automáticamente la nueva dirección
      
      return newAddress;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear la dirección';
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// PUT /addresses/{addressId}
export const updateAddress = createAsyncThunk(
  'checkout/updateAddress',
  async ({ addressId, addressData }, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.put(`/addresses/${addressId}`, addressData);
      const updatedAddress = response.data;
      
      dispatch(updateAddressAction(updatedAddress));
      
      // Actualizar la dirección seleccionada si es necesario
      const { selectedAddress } = getState().checkout;
      if (selectedAddress?.addressId === addressId) {
        dispatch(setSelectedAddress(updatedAddress));
      }
      
      return updatedAddress;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar la dirección';
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// DELETE /addresses/{addressId}
export const deleteAddress = createAsyncThunk(
  'checkout/deleteAddress',
  async (addressId, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await api.delete(`/addresses/${addressId}`);
      
      dispatch(removeAddressAction(addressId));
      
      // Limpiar la dirección seleccionada si es necesario
      const { selectedAddress } = getState().checkout;
      if (selectedAddress?.addressId === addressId) {
        dispatch(setSelectedAddress(null));
      }
      
      return addressId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar la dirección';
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);