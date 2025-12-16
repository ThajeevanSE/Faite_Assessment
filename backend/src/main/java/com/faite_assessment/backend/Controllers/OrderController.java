package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.Order;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Security.JwtUtil;
import com.faite_assessment.backend.Services.CartService;
import com.faite_assessment.backend.Services.OrderService;
import com.faite_assessment.backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final CartService cartService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/place")
    public Order placeOrder(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderService.placeOrder(user, cartService.getCart(user));
    }
}

