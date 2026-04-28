package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Get all products (admin)
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get only approved products (marketplace)
    @GetMapping("/approved")
    public List<Product> getApprovedProducts() {
        return productService.getApprovedProducts();
    }

    // Get products by farmer
    @GetMapping("/farmer/{farmerId}")
    public List<Product> getByFarmer(@PathVariable String farmerId) {
        return productService.getProductsByFarmer(farmerId);
    }

    // Create a new product
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Product saved = productService.createProduct(product);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Update a product
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product product) {
        try {
            Product updated = productService.updateProduct(id, product);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Approve a product (admin)
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveProduct(@PathVariable String id) {
        try {
            Product approved = productService.approveProduct(id);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Delete a product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
