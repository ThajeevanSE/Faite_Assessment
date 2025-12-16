package com.faite_assessment.backend.Repositories;

import com.faite_assessment.backend.Entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}

