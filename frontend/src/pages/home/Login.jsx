import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(username, password);
      navigate('/'); // Chuyển hướng về trang chủ sau khi đăng nhập thành công
    } catch (err) {
      console.log('Error caught:', err); // Giữ dòng này để debug
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(errorMessage);
      
      // Hiển thị thông báo lỗi
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div>
      <div className="collection-header">
        <div className="collection-hero">
        </div>
      </div>

      <div id="page-content">
        <div className="page section-header text-center">
          <div className="page-title">
            <div className="wrapper">
              <h1 className="page-width">Đăng nhập</h1>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 main-col offset-md-3">
              <div className="mb-4">
                <div onSubmit={handleSubmit} id="CustomerLoginForm" className="contact-form">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      {error && <div className="alert alert-danger">{error}</div>}
                      <div className="form-group">
                        <label htmlFor="CustomerEmail">Tên đăng nhập</label>
                        <input
                          type="text"
                          name="username"
                          placeholder="Nhập tên đăng nhập"
                          id="CustomerEmail"
                          className=""
                          autoCorrect="off"
                          autoCapitalize="off"
                          autoFocus={true}
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label htmlFor="CustomerPassword">Mật khẩu</label>
                        <input
                          type="password"
                          value={password}
                          name="password"
                          placeholder="Nhập mật khẩu"
                          id="CustomerPassword"
                          className=""
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-center col-12 col-sm-12 col-md-12 col-lg-12">
                      <button type="button" className="btn mb-3" onClick={handleSubmit}>Đăng nhập</button>
                      <p className="mb-4">
                        <RouterLink to="/forgot-password">Quên mật khẩu?</RouterLink>
                        &nbsp; | &nbsp;
                        <RouterLink to="/register">Tạo tài khoản mới</RouterLink>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 