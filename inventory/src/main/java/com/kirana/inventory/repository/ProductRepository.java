package com.kirana.inventory.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.kirana.inventory.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Additional query methods can be defined here if needed
    // For example, to find products by name:
    // List<Product> findByName(String name);
    // Or to find products below a certain threshold:
    // List<Product> findByQuantityLessThan(int threshold);
    // JpaRepository provides basic CRUD operations out of the box
    // so you may not need to define any additional methods unless specific queries are required.
    
    List<Product> findByQuantityLessThan(int threshold);

    @Query("SELECT p FROM Product p WHERE p.quantity < p.threshold")
List<Product> findLowStockProducts();
  

Optional<Product> findByName(String name); 
}
