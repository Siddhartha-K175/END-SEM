package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "productId", length = 50, nullable = false)
    private String productId;

    @Column(name = "buyerId", length = 50, nullable = false)
    private String buyerId;

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String buyerId) { this.buyerId = buyerId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
