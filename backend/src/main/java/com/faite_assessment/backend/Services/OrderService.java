package com.faite_assessment.backend.Services;

import com.faite_assessment.backend.Entities.Order;
import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Repositories.OrderRepository;
import com.faite_assessment.backend.Repositories.ProductRepository;
import com.faite_assessment.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate; // For Real-time notifications

    public Order createOrder(String buyerEmail, Long productId, String address, String phone, String paymentMethod) {
        User buyer = userRepository.findByEmail(buyerEmail)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // The seller is the owner of the product
        User seller = product.getUser();

        Order order = Order.builder()
                .buyer(buyer)
                .seller(seller)
                .product(product)
                .shippingAddress(address)
                .phoneNumber(phone)
                .paymentMethod(paymentMethod)
                .status("PENDING")
                .build();

        Order savedOrder = orderRepository.save(order);

        // --- REAL-TIME NOTIFICATION ---
        // We send a message to the seller's specific queue
        String notificationMessage = "New Order! " + buyer.getName() + " ordered " + product.getTitle();

        // You can send a simple string or a full object.
        // Sending to: /user/{sellerEmail}/queue/notifications
        messagingTemplate.convertAndSendToUser(
                seller.getEmail(),
                "/queue/notifications",
                notificationMessage
        );

        return savedOrder;
    }

    public List<Order> getMyOrders(String email) {
        return orderRepository.findByBuyerEmail(email);
    }

    public List<Order> getOrdersForMyProducts(String email) {
        return orderRepository.findBySellerEmail(email);
    }
}