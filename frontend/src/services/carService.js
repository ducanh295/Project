import api from './api';

const carService = {
    // Lấy danh sách xe
    getAllCars: async () => {
        try {
            console.log('Fetching cars from API...');
            const response = await api.get('/api/products');
            console.log('API Response:', response);
            
            // Kiểm tra và xử lý dữ liệu
            if (response.data) {
                console.log('Received data:', response.data);
                return response.data;
            } else {
                console.warn('API returned empty data');
                return [];
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            throw error;
        }
    },

    // Lấy thông tin chi tiết xe
    getCarById: async (id) => {
        try {
            const response = await api.get(`/api/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching car details:', error);
            throw error;
        }
    },

    // Tìm kiếm sản phẩm theo tên
    searchProducts: async (searchTerm) => {
        try {
            console.log(`Searching products with term: ${searchTerm}`);
            const response = await api.get('/api/products', { params: { name: searchTerm } });
            console.log('API Response for product search:', response);
            if (response.data) {
            return response.data;
            } else {
                console.warn(`API returned empty data for search term ${searchTerm}`);
                return [];
            }
        } catch (error) {
            console.error(`Error searching products with term ${searchTerm}:`, error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            throw error;
        }
    },

    // Lấy danh sách xe theo loại
    getCarsByType: async (type) => {
        try {
            const response = await api.get(`/api/cars/type/${type}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cars by type:', error);
            throw error;
        }
    },

    // New method: Lấy danh sách sản phẩm theo danh mục
    getProductsByCategory: async (categoryId) => {
        try {
            console.log(`Fetching products for category: ${categoryId}`);
            const response = await api.get(`/api/categories/${categoryId}/products`);
            console.log('API Response for products by category:', response);
            if (response.data) {
                return response.data;
            } else {
                console.warn(`API returned empty data for category ${categoryId}`);
                return [];
            }
        } catch (error) {
            console.error(`Error fetching products by category ${categoryId}:`, error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            throw error;
        }
    },

    // Lấy giỏ hàng của user
    getCart: async () => {
        try {
            const response = await api.get('/api/cart');
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    }
};

export default carService; 