package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.Feedback;
import com.example.demo.repository.FeedbackRepository;

import java.util.List;
import java.util.UUID;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public List<Feedback> getFeedbackByProduct(String productId) {
        return feedbackRepository.findByProductId(productId);
    }

    public List<Feedback> getFeedbackByBuyer(String buyerId) {
        return feedbackRepository.findByBuyerId(buyerId);
    }

    public Feedback createFeedback(Feedback feedback) {
        if (feedback.getId() == null || feedback.getId().trim().isEmpty())
            feedback.setId(UUID.randomUUID().toString());
        if (feedback.getMessage() == null || feedback.getMessage().trim().isEmpty())
            throw new RuntimeException("Message is required.");
        return feedbackRepository.save(feedback);
    }
}
