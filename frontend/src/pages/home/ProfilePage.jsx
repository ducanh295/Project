import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Assume AuthContext provides user info
import userService from '../../services/userService';

const ProfilePage = () => {
    const { user, login } = useAuth(); // Assuming login function can update user context
    const [fullname, setFullname] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [nationality, setNationality] = useState('Việt Nam');
    const [hobbies, setHobbies] = useState([]);
    const [bio, setBio] = useState('');
    const [picture, setPicture] = useState(''); // This stores the filename string from backend
    const [selectedFile, setSelectedFile] = useState(null); // New state to store the File object
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const imagePreviewRef = useRef(null);
    const fileInputRef = useRef(null);
    const avatarNamePlaceholderRef = useRef(null);

    const defaultAvatarPath = '/assets/images/avatar_default.png';
    const backendUploadsBaseUrl = 'http://localhost:8080/uploads/'; // Adjust if your backend serves images differently

    useEffect(() => {
        userService.getUserProfile().then(data => {
            setFullname(data.fullName || '');
            setEmail(data.email || '');
            setDateOfBirth(data.dateOfBirth || '');
            setPhone(data.phone || '');
            setGender(data.gender || '');
            setAddress(data.address || '');
            setNationality(data.nationality || 'Việt Nam');
            setHobbies(data.hobbies ? data.hobbies.split(',') : []);
            setBio(data.bio || '');
            setPicture(data.picture || '');
            if (imagePreviewRef.current) {
                if (data.picture) {
                    imagePreviewRef.current.src = `${backendUploadsBaseUrl}${data.picture}`;
                } else {
                    imagePreviewRef.current.src = defaultAvatarPath;
                }
            }
        });
    }, []);

    // Update placeholder for avatar name
    useEffect(() => {
        if (avatarNamePlaceholderRef.current) {
            if (fullname.trim() !== '' && imagePreviewRef.current.src.includes(defaultAvatarPath)) {
                avatarNamePlaceholderRef.current.textContent = fullname;
            } else if (!imagePreviewRef.current.src.includes(defaultAvatarPath)) {
                avatarNamePlaceholderRef.current.textContent = '';
            } else {
                avatarNamePlaceholderRef.current.textContent = 'Tên của bạn';
            }
        }
    }, [fullname, user]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file); // Store the selected file object
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                if (imagePreviewRef.current) {
                    imagePreviewRef.current.src = event.target.result;
                }
            }
            reader.readAsDataURL(file);
            if (avatarNamePlaceholderRef.current) {
                avatarNamePlaceholderRef.current.textContent = '';
            }
        } else {
            setSelectedFile(null); // Clear selected file if none is chosen
            if (imagePreviewRef.current) {
                // When no file is selected, revert to current user's picture from backend or default
                imagePreviewRef.current.src = picture ? `${backendUploadsBaseUrl}${picture}` : defaultAvatarPath;
            }
            // updateAvatarNamePlaceholder logic if needed for reset
        }
    };

    const handleHobbyChange = (e) => {
        const value = e.target.value;
        setHobbies(prevHobbies =>
            prevHobbies.includes(value)
                ? prevHobbies.filter(hobby => hobby !== value)
                : [...prevHobbies, value]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const formData = new FormData(); // Use FormData for file uploads
            formData.append('fullname', fullname);
            formData.append('dateOfBirth', dateOfBirth);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('gender', gender);
            formData.append('address', address);
            formData.append('nationality', nationality);
            formData.append('hobbies', hobbies.join(','));
            formData.append('bio', bio);

            if (selectedFile) {
                formData.append('file', selectedFile); // Append the actual file
            } else if (picture) {
                // If no new file is selected but there was an existing picture, send its name
                // This handles cases where user doesn't change picture but updates other fields
                formData.append('picture', picture); 
            } else {
                // If no new file and no existing picture, send an empty string to clear the picture
                formData.append('picture', '');
            }

            // Make sure your userService.updateUserProfile sends FormData correctly
            await userService.updateUserProfile(formData); 
            setMessage('Cập nhật hồ sơ thành công!');
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại.');
        }
    };

    const handleReset = () => {
        // Reset form to initial user state or clear it
        if (user) {
            setFullname(user.fullName || '');
            setDateOfBirth(user.dateOfBirth || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setGender(user.gender || '');
            setAddress(user.address || '');
            setNationality(user.nationality || 'Việt Nam');
            setHobbies(user.hobbies ? user.hobbies.split(',') : []);
            setBio(user.bio || '');
            setPicture(user.picture || '');
            if (imagePreviewRef.current) {
                // Reset image preview to the actual user's picture from backend or default
                imagePreviewRef.current.src = user.picture ? `${backendUploadsBaseUrl}${user.picture}` : defaultAvatarPath;
            }
        } else {
            setFullname('');
            setDateOfBirth('');
            setEmail('');
            setPhone('');
            setGender('');
            setAddress('');
            setNationality('Việt Nam');
            setHobbies([]);
            setBio('');
            setPicture('');
            if (imagePreviewRef.current) {
                imagePreviewRef.current.src = defaultAvatarPath;
            }
        }
        setMessage('');
        setError('');
    };


    return (
        <div className="profile-container">
            <div className="profile-avatar-section">
                {/* Initial src should reflect current user's picture or default */}
                <img id="imagePreview" ref={imagePreviewRef} src={picture ? `${backendUploadsBaseUrl}${picture}` : defaultAvatarPath} alt="Ảnh đại diện" onClick={() => fileInputRef.current.click()} />
                <label htmlFor="anhCaNhanInput" className="custom-file-upload">
                    Tải Ảnh Lên
                </label>
                <input type="file" id="anhCaNhanInput" ref={fileInputRef} name="anhCaNhan" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <div id="avatarNamePlaceholder" ref={avatarNamePlaceholderRef} className="avatar-name-placeholder"></div>
            </div>

            <div className="profile-info-section">
                <h2>Thông Tin Hồ Sơ</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="hoTen">Họ và Tên:</label>
                            <input type="text" id="hoTen" name="hoTen" placeholder="Nguyễn Văn A" required value={fullname} onChange={(e) => setFullname(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ngaySinh">Ngày sinh:</label>
                            <input type="date" id="ngaySinh" name="ngaySinh" required value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" placeholder="vidu@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="soDienThoai">Số điện thoại:</label>
                            <input type="tel" id="soDienThoai" name="soDienThoai" placeholder="09xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Giới tính:</label>
                        <div className="radio-group" style={{ paddingTop: '8px' }}>
                            <input type="radio" id="nam" name="gioiTinh" value="Nam" checked={gender === 'Nam'} onChange={(e) => setGender(e.target.value)} />
                            <label htmlFor="nam">Nam</label>
                            <input type="radio" id="nu" name="gioiTinh" value="Nữ" checked={gender === 'Nữ'} onChange={(e) => setGender(e.target.value)} />
                            <label htmlFor="nu">Nữ</label>
                            <input type="radio" id="khac" name="gioiTinh" value="Khác" checked={gender === 'Khác'} onChange={(e) => setGender(e.target.value)} />
                            <label htmlFor="khac">Khác</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="diaChi">Địa chỉ:</label>
                        <input type="text" id="diaChi" name="diaChi" placeholder="Số nhà, đường, phường/xã,..." value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="quocTich">Quốc tịch:</label>
                            <select id="quocTich" name="quocTich" value={nationality} onChange={(e) => setNationality(e.target.value)}>
                                <option value="Việt Nam">Việt Nam</option>
                                <option value="Hoa Kỳ">Hoa Kỳ</option>
                                <option value="Nhật Bản">Nhật Bản</option>
                                <option value="Hàn Quốc">Hàn Quốc</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Sở thích (chọn nhiều):</label>
                            <div className="checkbox-group" style={{ paddingTop: '8px', display: 'flex', flexWrap: 'wrap' }}>
                                <span style={{ marginRight: '15px' }}><input type="checkbox" id="docSach" name="soThich" value="Cà phê" checked={hobbies.includes('Cà phê')} onChange={handleHobbyChange} /><label htmlFor="docSach">Cà phê</label></span>
                                <span style={{ marginRight: '15px' }}><input type="checkbox" id="theThao" name="soThich" value="Thể thao" checked={hobbies.includes('Thể thao')} onChange={handleHobbyChange} /><label htmlFor="theThao">Thể thao</label></span>
                                <span style={{ marginRight: '15px' }}><input type="checkbox" id="duLich" name="soThich" value="Du lịch" checked={hobbies.includes('Du lịch')} onChange={handleHobbyChange} /><label htmlFor="duLich">Du lịch</label></span>
                                <span style={{ marginRight: '15px' }}><input type="checkbox" id="amNhac" name="soThich" value="Âm nhạc" checked={hobbies.includes('Âm nhạc')} onChange={handleHobbyChange} /><label htmlFor="amNhac">Âm nhạc</label></span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ghiChu">Giới thiệu bản thân:</label>
                        <textarea id="ghiChu" name="ghiChu" placeholder="Một vài dòng về bạn..." value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                    </div>

                    {message && <p className="success-message" style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
                    {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <div className="button-group">
                        <button type="reset" onClick={handleReset}>Làm lại</button>
                        <button type="submit">Lưu Thay Đổi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage; 