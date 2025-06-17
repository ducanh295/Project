import api from './api';

const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await api.get('/api/categories');
            if (Array.isArray(response.data)) {
                return response.data;
            } else {
                console.warn('API trả về dữ liệu không phải mảng cho danh mục:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
            throw error;
        }
    },

    getProductsByCategory: async (categoryId) => {
        try {
            const response = await api.get(`/api/categories/${categoryId}/products`);
            if (Array.isArray(response.data)) {
                return response.data;
            } else {
                console.warn('API trả về dữ liệu không phải mảng cho sản phẩm theo danh mục:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm theo danh mục:', error);
            throw error;
        }
    }
};

export default categoryService; 