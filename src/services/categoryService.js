import api from './api';

const categoryService = {
  getAll: async (pageNumber = 0, pageSize = 10) => {
    const response = await api.get('/public/categories', {
      params: { pageNumber, pageSize }
    });
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/public/categories', categoryData);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await api.put(`/public/categories/${categoryId}`, categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/admin/categories/${categoryId}`);
    return response.data;
  }
};

export default categoryService;