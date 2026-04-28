package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Feedback;
import com.example.demo.service.FeedbackService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // Get all feedback (admin)
    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    // Get feedback for a product
    @GetMapping("/product/{productId}")
    public List<Feedback> getByProduct(@PathVariable String productId) {
        return feedbackService.getFeedbackByProduct(productId);
    }

    // Get feedback by buyer
    @GetMapping("/buyer/{buyerId}")
    public List<Feedback> getByBuyer(@PathVariable String buyerId) {
        return feedbackService.getFeedbackByBuyer(buyerId);
    }

    // Submit feedback
    @PostMapping
    public ResponseEntity<?> createFeedback(@RequestBody Feedback feedback) {
        try {
            Feedback saved = feedbackService.createFeedback(feedback);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
