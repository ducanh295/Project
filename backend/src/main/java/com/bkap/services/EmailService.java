package com.bkap.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendOTPEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("nkda941@gmail.com"); // Cần cấu hình email gửi trong application.properties
        message.setTo(to);
        message.setSubject("Mã xác thực đặt lại mật khẩu");
        message.setText("Mã OTP của bạn là: " + otp + "\n\n" +
                       "Mã này có hiệu lực trong 5 phút.\n" +
                       "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.");
        
        emailSender.send(message);
    }
} 