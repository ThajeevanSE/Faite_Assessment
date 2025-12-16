package com.faite_assessment.backend.Services;

import com.faite_assessment.backend.Entities.CartItem;
import com.faite_assessment.backend.Entities.Order;
import com.faite_assessment.backend.Entities.OrderItem;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Repositories.OrderItemRepository;
import com.faite_assessment.backend.Repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartService cartService;

    public Order placeOrder(User user, List<CartItem> cartItems) {

        double total = cartItems.stream()
                .mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity())
                .sum();

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(total);
        order = orderRepository.save(order);

        for (CartItem item : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(item.getProduct());
            oi.setPrice(item.getProduct().getPrice());
            oi.setQuantity(item.getQuantity());
            orderItemRepository.save(oi);
        }

        cartService.clearCart(user);
        return order;
    }
}
