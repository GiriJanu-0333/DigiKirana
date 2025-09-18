package com.kirana.inventory.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.kirana.inventory.model.Product;
import com.kirana.inventory.repository.ProductRepository;

import com.kirana.inventory.dto.AddStockRequest;
import com.kirana.inventory.dto.UpdateProductRequest;
import java.util.stream.Collectors;

// This service class handles business logic related to products.
// in easy word ithe apn can say that this class is used to perform operations on products like create, read, update and delete.
// It uses the ProductRepository to interact with the database.

@Service
public class ProductService {
    private final ProductRepository productRepository;
        public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // This will handle both new products and quantity updates for existing products
public Product addOrUpdateProduct(Product product) {
    // Check if a product with the same name exists
    Product existingProduct = productRepository.findByName(product.getName())
            .orElse(null);

    if (existingProduct != null) {
        // Product exists → increase quantity
        existingProduct.setQuantity(existingProduct.getQuantity() + product.getQuantity());
        existingProduct.setPrice(product.getPrice()); // optional: update price
        existingProduct.setThreshold(product.getThreshold()); // optional: update threshold
        return productRepository.save(existingProduct);
    } else {
        // Product doesn't exist → save new
        return productRepository.save(product);
    }
}

public Product updateProductDetails(Long id, Product updatedProduct) {
    return productRepository.findById(id)
            .map(product -> {
                product.setName(updatedProduct.getName());
                product.setPrice(updatedProduct.getPrice());
                product.setThreshold(updatedProduct.getThreshold());
                return productRepository.save(product);
            })
            .orElse(null);
}


    public void deleteProduct(Long id) {
    productRepository.deleteById(id);
}

//     public Product updateProduct(Long id, Product updatedProduct) {
//     Optional<Product> optional = productRepository.findById(id);
//     if (optional.isPresent()) {
//         Product product = optional.get();
//         product.setName(updatedProduct.getName());
//         product.setPrice(updatedProduct.getPrice());
//         product.setQuantity(updatedProduct.getQuantity());
//         product.setThreshold(updatedProduct.getThreshold());
//         return productRepository.save(product);
//     }
//     return null;
// }

// public Product updateProductFromRequest(UpdateProductRequest request) {
//     Product product = productRepository.findById(request.getProductId())
//             .orElseThrow(() -> new RuntimeException("Product not found"));

//     product.setName(request.getName());
//     product.setPrice(request.getPrice());
//     product.setThreshold(request.getThreshold());

//     return productRepository.save(product);
// }
    

       // ✅ New Method 1: Add Stock
    public Product addStock(AddStockRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setQuantity(product.getQuantity() + request.getQuantity());
        return productRepository.save(product);
    }
    // ✅ New Method 2: Update Product Details
    public Product updateProduct(UpdateProductRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setThreshold(request.getThreshold());

        return productRepository.save(product);
    }


public List<Product> getLowStockProducts() {
    return productRepository.findAll()
            .stream()
            .filter(p -> p.getThreshold() != 0) // ignore threshold = 0
            .filter(p -> p.getQuantity() < p.getThreshold())
            .collect(Collectors.toList());
}

}