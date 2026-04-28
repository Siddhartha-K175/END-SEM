package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getApprovedProducts() {
        return productRepository.findByStatus("approved");
    }

    public List<Product> getProductsByFarmer(String farmerId) {
        return productRepository.findByFarmerId(farmerId);
    }

    public Product createProduct(Product product) {
        if (product.getId() == null || product.getId().trim().isEmpty())
            product.setId(UUID.randomUUID().toString());
        if (product.getStatus() == null)
            product.setStatus("pending");
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updated) {
        Product existing = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found."));
        existing.setTitle(updated.getTitle());
        existing.setCategory(updated.getCategory());
        existing.setOrigin(updated.getOrigin());
        existing.setPrice(updated.getPrice());
        existing.setCurrency(updated.getCurrency());
        existing.setUnit(updated.getUnit());
        existing.setStock(updated.getStock());
        existing.setProcess(updated.getProcess());
        existing.setShelfLife(updated.getShelfLife());
        existing.setCertifications(updated.getCertifications());
        existing.setTargetBuyer(updated.getTargetBuyer());
        existing.setShortDesc(updated.getShortDesc());
        existing.setDescription(updated.getDescription());
        existing.setBullets(updated.getBullets());
        return productRepository.save(existing);
    }

    public Product approveProduct(String id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found."));
        product.setStatus("approved");
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
