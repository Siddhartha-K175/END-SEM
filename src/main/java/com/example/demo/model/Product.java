package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "farmerId", length = 50)
    private String farmerId;

    @Column(name = "status")
    private String status;

    @Column(name = "title")
    private String title;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "origin")
    private String origin;

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "currency", length = 10)
    private String currency;

    @Column(name = "unit", length = 50)
    private String unit;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "process", columnDefinition = "TEXT")
    private String process;

    @Column(name = "shelfLife")
    private String shelfLife;

    @Column(name = "certifications", columnDefinition = "JSON")
    private String certifications;

    @Column(name = "targetBuyer")
    private String targetBuyer;

    @Column(name = "short", columnDefinition = "TEXT")
    private String shortDesc;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "bullets", columnDefinition = "JSON")
    private String bullets;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (status == null) status = "pending";
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getProcess() { return process; }
    public void setProcess(String process) { this.process = process; }

    public String getShelfLife() { return shelfLife; }
    public void setShelfLife(String shelfLife) { this.shelfLife = shelfLife; }

    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }

    public String getTargetBuyer() { return targetBuyer; }
    public void setTargetBuyer(String targetBuyer) { this.targetBuyer = targetBuyer; }

    public String getShortDesc() { return shortDesc; }
    public void setShortDesc(String shortDesc) { this.shortDesc = shortDesc; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBullets() { return bullets; }
    public void setBullets(String bullets) { this.bullets = bullets; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
