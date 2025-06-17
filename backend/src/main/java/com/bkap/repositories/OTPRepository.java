package com.bkap.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bkap.entities.OTP;

@Repository
public interface OTPRepository extends JpaRepository<OTP, String> {
    Optional<OTP> findByEmailAndOtpCodeAndUsedFalse(String email, String otpCode);
} 