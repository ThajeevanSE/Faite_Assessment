package com.faite_assessment.backend.Controllers;


import com.faite_assessment.backend.Entities.Category;
import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Security.JwtUtil;
import com.faite_assessment.backend.Services.CategoryService;
import com.faite_assessment.backend.Services.ProductService;
import com.faite_assessment.backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    // 🔹 ADD PRODUCT (USER)
    @PostMapping
    public Product addProduct(
            @RequestBody Product product,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User seller = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        product.setSeller(seller);
        product.setStatus("AVAILABLE");

        return productService.save(product);
    }

    // 🔹 GET ALL PRODUCTS (PUBLIC)
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAll();
    }

    // 🔹 GET PRODUCTS BY CATEGORY ID
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        Category category = categoryService.getById(categoryId);
        return productService.getByCategory(category);
    }
}

