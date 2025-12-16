package com.faite_assessment.backend.Services;

import com.faite_assessment.backend.Entities.CartItem;
import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Repositories.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;

    public CartItem addToCart(User user, Product product) {

        return cartItemRepository.findByUserAndProduct(user, product)
                .map(item -> {
                    item.setQuantity(item.getQuantity() + 1);
                    return cartItemRepository.save(item);
                })
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setUser(user);
                    item.setProduct(product);
                    item.setQuantity(1);
                    return cartItemRepository.save(item);
                });
    }

    public List<CartItem> getCart(User user) {
        return cartItemRepository.findByUser(user);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteAll(getCart(user));
    }
}

