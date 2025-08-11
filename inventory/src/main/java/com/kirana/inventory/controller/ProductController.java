package com.kirana.inventory.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kirana.inventory.dto.AddStockRequest;
import com.kirana.inventory.dto.UpdateProductRequest;
import com.kirana.inventory.model.Product;
import com.kirana.inventory.service.ProductService;

@CrossOrigin(origins = "http://localhost:3000") // Adjust the origin as needed
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAll() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // ✅ POST create product
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    // ✅ PUT update product using full Product
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    // ✅ DELETE product by ID
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        
    }

    // ✅ POST add stock
    @PostMapping("/add-stock")
    public ResponseEntity<Product> addStock(@RequestBody AddStockRequest request) {
        return ResponseEntity.ok(productService.addStock(request));
    }

    // ✅ PUT update product using custom DTO
    @PutMapping("/update")
    public ResponseEntity<Product> updateProduct(@RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(request));
    }

    @GetMapping("/low-stock")
public List<Product> getLowStockProducts() {
    return productService.getLowStockProducts();
}

}
