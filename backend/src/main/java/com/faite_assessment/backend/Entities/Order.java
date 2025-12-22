package com.faite_assessment.backend.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The customer buying the item
    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    // The user selling the item
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    // The product being sold
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String shippingAddress;

    @Column(nullable = false)
    private String phoneNumber;

    // "COD" (Cash on Delivery) or "ONLINE"
    @Column(nullable = false)
    private String paymentMethod;

    // PENDING, PAID, SHIPPED, CANCELLED
    @Column(nullable = false)
    private String status;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        // Default status
        if (this.status == null) this.status = "PENDING";
    }
}