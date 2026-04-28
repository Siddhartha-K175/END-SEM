package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.Order;
import com.example.demo.repository.OrderRepository;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByBuyer(String buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    public Order createOrder(Order order) {
        if (order.getId() == null || order.getId().trim().isEmpty())
            order.setId(UUID.randomUUID().toString());
        if (order.getStatus() == null)
            order.setStatus("pending");
        return orderRepository.save(order);
    }

    public Order updateStatus(String id, String status) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found."));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
