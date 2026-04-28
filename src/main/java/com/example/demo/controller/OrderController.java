package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Order;
import com.example.demo.service.OrderService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Get all orders (admin)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Get orders by buyer
    @GetMapping("/buyer/{buyerId}")
    public List<Order> getByBuyer(@PathVariable String buyerId) {
        return orderService.getOrdersByBuyer(buyerId);
    }

    // Place a new order
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            Order saved = orderService.createOrder(order);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            Order updated = orderService.updateStatus(id, body.get("status"));
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
