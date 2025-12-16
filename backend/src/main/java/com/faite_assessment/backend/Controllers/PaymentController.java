package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.Payment;
import com.faite_assessment.backend.Security.JwtUtil;
import com.faite_assessment.backend.Services.PaymentService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtUtil jwtUtil;

    @PostMapping("/create/{orderId}")
    public Payment createPayment(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String authHeader
    ) throws StripeException {

        String token = authHeader.substring(7);
        jwtUtil.extractEmail(token); // validate token only

        return paymentService.createPaymentIntent(orderId);
    }
}
