import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Try to get email from location state if navigated from ForgotPasswordPage
    React.useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/reset-password',
                new URLSearchParams({
                    email: email,
                    otp: otp,
                    newPassword: newPassword
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            setMessage(response.data);
            setTimeout(() => {
                navigate('/login'); // Navigate to login page after successful password reset
            }, 3000); // Redirect after 3 seconds
        } catch (err) {
            console.error('Error resetting password:', err);
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h2 style={styles.title}>Đặt Lại Mật Khẩu</h2>
                <p style={styles.description}>Vui lòng nhập mã OTP và mật khẩu mới của bạn.</p>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                            readOnly={!!location.state && !!location.state.email} // Make read-only if email came from state
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="otp" style={styles.label}>Mã OTP:</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength="6"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="newPassword" style={styles.label}>Mật khẩu mới:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="confirmPassword" style={styles.label}>Xác nhận mật khẩu mới:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    {message && <p style={styles.successMessage}>{message}</p>}
                    {error && <p style={styles.errorMessage}>{error}</p>}
                    <button type="submit" style={styles.button}>Đặt Lại Mật Khẩu</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    },
    formCard: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    title: {
        fontSize: '28px',
        color: '#333',
        marginBottom: '15px',
    },
    description: {
        fontSize: '16px',
        color: '#666',
        marginBottom: '30px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '15px',
        color: '#555',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    button: {
        backgroundColor: '#28a745',
        color: '#fff',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '17px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#218838',
    },
    successMessage: {
        color: '#28a745',
        marginTop: '10px',
        fontSize: '15px',
        fontWeight: 'bold',
    },
    errorMessage: {
        color: '#dc3545',
        marginTop: '10px',
        fontSize: '15px',
        fontWeight: 'bold',
    },
};

export default ResetPasswordPage; 