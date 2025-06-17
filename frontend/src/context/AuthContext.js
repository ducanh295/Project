import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra token và lấy thông tin user khi component mount
        const token = localStorage.getItem('token');
        if (token) {
            authService.getCurrentUser()
                .then(userData => {
                    setUser(userData);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const userData = await authService.login(username, password);
        setUser(userData);
        
        // Hiển thị thông báo đăng nhập thành công với tên người dùng
        toast.success(<span>Đăng nhập thành công! Chào mừng <strong style={{ color: '#007bff' }}>{userData.fullname}</strong> đến với website của chúng tôi</span>, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        
        return userData;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        console.log('Attempting to show logout toast.'); // <--- Thêm dòng này
        // Hiển thị thông báo đăng xuất thành công
        toast.success('Đăng xuất thành công! Hẹn gặp lại bạn', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        navigate('/');
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        return response;
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 