package com.faite_assessment.backend.Repositories;

import com.faite_assessment.backend.Entities.Category;
import com.faite_assessment.backend.Entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByCategory(Category category);

    List<Product> findByid(Long id);
}