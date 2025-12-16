package com.faite_assessment.backend.Repositories;

import com.faite_assessment.backend.Entities.Order;
import com.faite_assessment.backend.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
