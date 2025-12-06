package com.faite_assessment.backend.Controllers;

import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Security.JwtUtil;
import com.faite_assessment.backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    //Admin check helper
    private void ensureAdmin(String token) {
        String email = jwtUtil.extractEmail(token);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Access denied: Admin only");
        }
    }

    //Get all users
    @GetMapping("/users")
    public List<User> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        ensureAdmin(token);

        return userService.getAllUsers();
    }

    //Delete user by ID
    @DeleteMapping("/users/{id}")
    public String deleteUser(@RequestHeader("Authorization") String authHeader,
                             @PathVariable Long id) {

        String token = authHeader.substring(7);
        ensureAdmin(token);

        userService.deleteUser(id);
        return "User deleted successfully";
    }
}
