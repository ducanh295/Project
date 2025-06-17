import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
    baseURL: 'http://localhost:8080', // URL của backend
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // Timeout sau 10 giây
});

// Thêm interceptor để xử lý request
api.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý response
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status);
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        
        if (error.response) {
            // Xử lý các lỗi từ server
            console.error('Error status:', error.response.status);
            console.error('Error data:', error.response.data);
            
            switch (error.response.status) {
                case 401:
                    console.log('Unauthorized - clearing token');
                    localStorage.removeItem('token');
                    // Không chuyển hướng cứng ở đây, để component gọi API xử lý
                    break;
                case 403:
                    console.log('Forbidden - access denied');
                    // Không chuyển hướng cứng ở đây, để component gọi API xử lý
                    break;
                case 404:
                    console.log('Resource not found');
                    break;
                case 500:
                    console.log('Server error');
                    break;
                default:
                    console.log('Other error');
                    break;
            }
        } else if (error.request) {
            // Request được gửi nhưng không nhận được response
            console.error('No response received:', error.request);
        } else {
            // Có lỗi khi thiết lập request
            console.error('Request setup error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default api; 