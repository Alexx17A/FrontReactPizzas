import api from './api';

const productService = {
  getAll: async (pageNumber = 0, pageSize = 10) => {
    const response = await api.get('/public/products', {
      params: { pageNumber, pageSize }
    });
    return response.data;
  },
  
  getByCategory: async (categoryId, pageNumber = 0, pageSize = 10) => {
    const response = await api.get(`/public/categories/${categoryId}/products`, {
      params: { pageNumber, pageSize }
    });
    return response.data;
  },
  
  searchByKeyword: async (keyword, pageNumber = 0, pageSize = 10) => {
    const response = await api.get(`/public/products/keyword/${keyword}`, {
      params: { pageNumber, pageSize }
    });
    return response.data;
  },
  
  createProduct: async (productData) => {
    const response = await api.post(`/admin/categories/${productData.categoryId}/product`, productData);
    return response.data;
  },
  
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/admin/products/${productId}`, productData);
    return response.data;
  },
  
  deleteProduct: async (productId) => {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },
  
  uploadImage: async (productId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.put(`/products/${productId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default productService;