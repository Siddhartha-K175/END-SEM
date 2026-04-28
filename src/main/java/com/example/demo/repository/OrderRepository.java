package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByBuyerId(String buyerId);
}
