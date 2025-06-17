import api from './api';

const authService = {
    // Đăng nhập
    login: async (username, password) => {
        try {
            const response = await api.post('/api/login', { username, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem('token');
    },

    // Đăng ký
    register: async (formData) => {
        try {
            const response = await api.post('/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        try {
            const response = await api.get('/api/user/current');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default authService; 