import api from './api';

const bookingService = {
    // Tạo đơn đặt xe mới
    createBooking: async (bookingData) => {
        try {
            const response = await api.post('/api/bookings', bookingData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy danh sách đơn đặt xe của user
    getUserBookings: async () => {
        try {
            const response = await api.get('/api/bookings/user');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chi tiết đơn đặt xe
    getBookingById: async (id) => {
        try {
            const response = await api.get(`/api/bookings/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Hủy đơn đặt xe
    cancelBooking: async (id) => {
        try {
            const response = await api.put(`/api/bookings/${id}/cancel`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật trạng thái đơn đặt xe
    updateBookingStatus: async (id, status) => {
        try {
            const response = await api.put(`/api/bookings/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default bookingService; 