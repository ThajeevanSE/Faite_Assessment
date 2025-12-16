package com.faite_assessment.backend.Services;

import com.faite_assessment.backend.Entities.Order;
import com.faite_assessment.backend.Entities.Payment;
import com.faite_assessment.backend.Repositories.OrderRepository;
import com.faite_assessment.backend.Repositories.PaymentRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public Payment createPaymentIntent(Long orderId) throws StripeException {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount((long) (order.getTotalAmount() * 100))
                        .setCurrency("usd")
                        .build();

        PaymentIntent intent = PaymentIntent.create(params);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentIntentId(intent.getId());

        return paymentRepository.save(payment);
    }

    public void markPaymentSuccess(String paymentIntentId) {
        Payment payment = paymentRepository.findByPaymentIntentId(paymentIntentId)
                .orElseThrow();

        payment.setStatus("SUCCESS");
        paymentRepository.save(payment);

        Order order = payment.getOrder();
        order.setStatus("CONFIRMED");
        orderRepository.save(order);
    }
}
