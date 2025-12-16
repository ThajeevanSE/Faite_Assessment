package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.CartItem;
import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Security.JwtUtil;
import com.faite_assessment.backend.Services.CartService;
import com.faite_assessment.backend.Services.ProductService;
import com.faite_assessment.backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final ProductService productService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/{productId}")
    public CartItem addToCart(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productService.getById(productId);

        return cartService.addToCart(user, product);
    }

    @GetMapping
    public List<CartItem> viewCart(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartService.getCart(user);
    }
}
