import api from './api';

const cartService = {
  getAllCarts: async () => {
    const response = await api.get('/api/carts');
    return response.data;
  },

  getCartById: async (cartId) => {
    const response = await api.get(`/api/carts/${cartId}`);
    return response.data;
  }
};

export default cartService;