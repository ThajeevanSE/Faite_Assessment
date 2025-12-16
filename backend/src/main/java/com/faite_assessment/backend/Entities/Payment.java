package com.faite_assessment.backend.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Order order;

    private Double amount;
    private String currency = "USD";
    private String status = "CREATED";

    private String paymentIntentId;

    private LocalDateTime createdAt = LocalDateTime.now();
}
