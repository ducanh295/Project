import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/forgot-password', 
                new URLSearchParams({ email: email }).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            setMessage(response.data.message);
            // Optionally navigate to a page informing the user to check their email
            // or navigate directly to the reset password page with email pre-filled
            // For now, we'll just display the message.
            navigate('/reset-password', { state: { email: email } }); 
        } catch (err) {
            console.error('Error sending forgot password request:', err);
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Có lỗi xảy ra khi gửi yêu cầu quên mật khẩu. Vui lòng thử lại.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h2 style={styles.title}>Quên Mật Khẩu</h2>
                <p style={styles.description}>Vui lòng nhập địa chỉ email của bạn để nhận mã xác thực.</p>
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
                        />
                    </div>
                    {message && <p style={styles.successMessage}>{message}</p>}
                    {error && <p style={styles.errorMessage}>{error}</p>}
                    <button type="submit" style={styles.button}>Gửi Mã Xác Thực</button>
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
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '17px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
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

export default ForgotPasswordPage; 