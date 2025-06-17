import api from './api';

const userService = {
    // Lấy thông tin user
    getUserProfile: async () => {
        try {
            const response = await api.get('/api/user/current');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật thông tin user
    updateUserProfile: async (userData) => {
        try {
            const response = await api.post('/api/user/update-profile', userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Đổi mật khẩu
    changePassword: async (passwordData) => {
        try {
            const response = await api.put('/api/users/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy lịch sử đặt xe của user
    getUserBookingHistory: async () => {
        try {
            const response = await api.get('/api/users/booking-history');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default userService; 