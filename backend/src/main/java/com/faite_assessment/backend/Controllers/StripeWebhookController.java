package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Services.PaymentService;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final PaymentService paymentService;

    @PostMapping("/stripe")
    public void handleStripeEvent(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) throws Exception {

        // ✅ USE STRIPE EVENT (NOT jdk.jfr.Event)
        Event event = Webhook.constructEvent(
                payload,
                sigHeader,
                "whsec_xxxxx"
        );

        // ✅ CHECK EVENT TYPE
        if ("payment_intent.succeeded".equals(event.getType())) {

            PaymentIntent intent = (PaymentIntent) event
                    .getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow(() -> new RuntimeException("PaymentIntent not found"));

            paymentService.markPaymentSuccess(intent.getId());
        }
    }
}
