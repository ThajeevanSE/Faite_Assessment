package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.Message;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Services.MessageService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @Data
    public static class MessageRequest {
        private Long receiverId;
        private Long productId;
        private String content;
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageRequest request, Authentication authentication) {
        return ResponseEntity.ok(
                messageService.sendMessage(authentication.getName(), request.getReceiverId(), request.getProductId(), request.getContent())
        );
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<Message>> getConversation(@PathVariable Long userId, Authentication authentication) {
        return ResponseEntity.ok(messageService.getConversation(authentication.getName(), userId));
    }
    @GetMapping("/inbox")
    public ResponseEntity<List<User>> getInbox(Authentication authentication) {
        return ResponseEntity.ok(messageService.getInbox(authentication.getName()));
    }
}