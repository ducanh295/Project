package com.bkap.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bkap.entities.Order;

public interface OrderRepository extends JpaRepository<Order, String> {

}