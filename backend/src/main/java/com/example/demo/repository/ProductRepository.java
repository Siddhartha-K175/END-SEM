package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Product;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByStatus(String status);
    List<Product> findByFarmerId(String farmerId);
}
