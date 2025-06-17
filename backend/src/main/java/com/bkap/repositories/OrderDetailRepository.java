package com.bkap.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bkap.entities.OrderDetail;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

}