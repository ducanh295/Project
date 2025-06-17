package com.bkap.services;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bkap.entities.OTP;
import com.bkap.repositories.OTPRepository;

@Service
public class OTPService {

    @Autowired
    private OTPRepository otpRepository;

    public void saveOTP(String email, String otpCode) {
        // Xóa OTP cũ nếu có
        otpRepository.deleteById(email);

        // Tạo OTP mới
        OTP otp = new OTP();
        otp.setEmail(email);
        otp.setOtpCode(otpCode);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // OTP có hiệu lực trong 5 phút
        otp.setUsed(false);

        otpRepository.save(otp);
    }

    public boolean validateOTP(String email, String otpCode) {
        Optional<OTP> otpOpt = otpRepository.findByEmailAndOtpCodeAndUsedFalse(email, otpCode);
        
        if (otpOpt.isPresent()) {
            OTP otp = otpOpt.get();
            
            // Kiểm tra OTP đã hết hạn chưa
            if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
                return false;
            }

            // Đánh dấu OTP đã được sử dụng
            otp.setUsed(true);
            otpRepository.save(otp);
            
            return true;
        }
        
        return false;
    }
} 