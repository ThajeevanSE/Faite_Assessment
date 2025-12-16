package com.faite_assessment.backend.Services;

import com.faite_assessment.backend.Entities.Category;
import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public List<Product> getByCategory(Category category) {
        return productRepository.findByCategory(category);
    }

    // 🔹 REQUIRED FOR CART CONTROLLER
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
}
