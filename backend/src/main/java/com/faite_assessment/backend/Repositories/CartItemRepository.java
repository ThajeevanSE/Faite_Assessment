package com.faite_assessment.backend.Repositories;

import com.faite_assessment.backend.Entities.CartItem;
import com.faite_assessment.backend.Entities.Product;
import com.faite_assessment.backend.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);
}
