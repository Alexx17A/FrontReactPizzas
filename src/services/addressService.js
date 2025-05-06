import api from './api';

const addressService = {
  getAllAddresses: async () => {
    const response = await api.get('/api/addresses');
    return response.data;
  },

  getAddressById: async (addressId) => {
    const response = await api.get(`/api/addresses/${addressId}`);
    return response.data;
  }
};

export default addressService;