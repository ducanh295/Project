import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const Register = () => {
  const [account, setAccount] = useState({
    username: '',
    password: '',
    confirmpassword: '',
    fullname: '',
    email: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState({}); // State để lưu trữ tất cả các lỗi
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
    // Clear error for the current field as user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    // Username validation
    if (!account.username) {
      newErrors.username = 'Tên đăng nhập không được để trống.';
      isValid = false;
    } else if (/\s/.test(account.username)) {
      newErrors.username = 'Tên đăng nhập không được có dấu cách.';
      isValid = false;
    }

    // Password validation
    if (!account.password) {
      newErrors.password = 'Mật khẩu không được để trống.';
      isValid = false;
    } else if (account.password.length < 3 || account.password.length > 12) {
      newErrors.password = 'Mật khẩu phải từ 3-12 ký tự.';
      isValid = false;
    }

    // Confirm password validation
    if (!account.confirmpassword) {
      newErrors.confirmpassword = 'Xác nhận mật khẩu không được để trống.';
      isValid = false;
    } else if (account.confirmpassword !== account.password) {
      newErrors.confirmpassword = 'Mật khẩu xác nhận không khớp.';
      isValid = false;
    }

    // Full Name validation
    if (!account.fullname) {
      newErrors.fullname = 'Họ và tên không được để trống.';
      isValid = false;
    } else if (/[^a-zA-Z0-9\s]/.test(account.fullname)) {
      newErrors.fullname = 'Họ và tên không được chứa ký tự đặc biệt.';
      isValid = false;
    }

    // Email validation
    if (!account.email) {
      newErrors.email = 'Email không được để trống.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(account.email)) {
        newErrors.email = 'Email không hợp lệ.';
        isValid = false;
    }

    // Phone validation (not required, but if entered, must be numeric)
    if (account.phone && !/^[0-9]+$/.test(account.phone)) {
      newErrors.phone = 'Số điện thoại phải là số.';
      isValid = false;
    }

    // Address is not required, no validation needed if empty

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return; // Stop if validation fails
    }

    const formData = new FormData();
    formData.append('username', account.username);
    formData.append('password', account.password);
    formData.append('fullname', account.fullname);
    formData.append('email', account.email);
    formData.append('address', account.address);
    formData.append('phone', account.phone);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await authService.register(formData);
      console.log('Registration successful:', response);
      
      // Hiển thị thông báo đăng ký thành công
      toast.success('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      let newErrors = {};

      if (error.response && error.response.data) {
        // Check if the backend response is an object (for multiple errors) or a string (for single error)
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          // If it's an object, assume it's a map of field errors
          newErrors = error.response.data; // Directly use the object for errors
        } else if (typeof error.response.data === 'string') {
          // If it's a string, handle it as a general error message
          let errorMessage = error.response.data.trim();
          newErrors.general = errorMessage; // Store as a general error
        } else {
          // Fallback for unexpected data types
          newErrors.general = 'Đăng ký thất bại. Vui lòng thử lại.';
        }
      } else {
        newErrors.general = 'Đăng ký thất bại. Vui lòng thử lại.'; // Default error message
      }
      
      setErrors(prevErrors => ({ ...prevErrors, ...newErrors })); // Update errors state
      localStorage.removeItem('token'); // Clear token on registration error
    }
  };

  return (
    <div>
      <div className="collection-header">
        <div className="collection-hero"></div>
      </div>

      <div id="page-content">
        <div className="page section-header text-center">
          <div className="page-title">
            <div className="wrapper">
              <h1 className="page-width">Create an Account</h1>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 main-col offset-md-3">
              <div className="mb-4">
                <form onSubmit={handleSubmit} className="contact-form" encType="multipart/form-data">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          autoFocus
                          className="form-control"
                          value={account.username}
                          onChange={handleChange}
                          // Remove required attribute
                        />
                        {errors.username && <span className="text-danger">{errors.username}</span>}
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={account.password}
                          onChange={handleChange}
                          // Remove required attribute
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm password</label>
                        <input
                          type="password"
                          name="confirmpassword"
                          id="confirmpassword"
                          value={account.confirmpassword}
                          onChange={handleChange}
                          // Remove required attribute
                        />
                        {errors.confirmpassword && <span className="text-danger">{errors.confirmpassword}</span>}
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label htmlFor="fullname">Full Name</label>
                        <input
                          type="text"
                          name="fullname"
                          id="fullname"
                          value={account.fullname}
                          onChange={handleChange}
                          // Remove required attribute
                        />
                        {errors.fullname && <span className="text-danger">{errors.fullname}</span>}
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={account.email}
                          onChange={handleChange}
                          // Remove required attribute
                        />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={account.address}
                          onChange={handleChange}
                          // Remove required attribute
                        />
                        {errors.address && <span className="text-danger">{errors.address}</span>}
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={account.phone}
                          onChange={handleChange}
                          // Remove required attribute
                        />
                        {errors.phone && <span className="text-danger">{errors.phone}</span>}
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label htmlFor="file">Picture</label>
                        <input
                          type="file"
                          name="file"
                          accept="image/png, image/jpeg"
                          id="file"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-center col-12 col-sm-12 col-md-12 col-lg-12">
                      <input type="submit" className="btn mb-3" value="Register" />
                      {errors.general && <span className="text-danger">{errors.general}</span>}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 