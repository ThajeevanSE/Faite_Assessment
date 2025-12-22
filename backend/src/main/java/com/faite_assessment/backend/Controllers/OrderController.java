package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.Order;
import com.faite_assessment.backend.Services.OrderService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Data
    public static class OrderRequest {
        private Long productId;
        private String shippingAddress;
        private String phoneNumber;
        private String paymentMethod; // "COD" or "ONLINE"
    }

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request, Authentication authentication) {
        Order order = orderService.createOrder(
                authentication.getName(), // Buyer email from token
                request.getProductId(),
                request.getShippingAddress(),
                request.getPhoneNumber(),
                request.getPaymentMethod()
        );
        return ResponseEntity.ok(order);
    }

    // Get items I bought
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getMyOrders(authentication.getName()));
    }

    // Get items I sold (Incoming orders)
    @GetMapping("/incoming-orders")
    public ResponseEntity<List<Order>> getIncomingOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrdersForMyProducts(authentication.getName()));
    }
}