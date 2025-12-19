package com.faite_assessment.backend.Repositories;

import com.faite_assessment.backend.Entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Fetch conversation between User A and User B (ordered by time)
    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.email = :user1 AND m.receiver.email = :user2) OR " +
            "(m.sender.email = :user2 AND m.receiver.email = :user1) " +
            "ORDER BY m.timestamp ASC")
    List<Message> findConversation(@Param("user1") String user1, @Param("user2") String user2);

    // Get list of users who have messaged the current user (for the Inbox sidebar)
    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver.email = :email")
    List<Object> findSenders(@Param("email") String email);
    List<Message> findAllBySenderEmailOrReceiverEmail(String senderEmail, String receiverEmail);
}