package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        if (user.getName() == null || user.getName().trim().isEmpty())
            throw new RuntimeException("Name is required.");
        if (user.getEmail() == null || user.getEmail().trim().isEmpty())
            throw new RuntimeException("Email is required.");
        if (user.getPassword() == null || user.getPassword().length() < 4)
            throw new RuntimeException("Password must be at least 4 characters.");
        if (user.getRole() == null || user.getRole().trim().isEmpty())
            throw new RuntimeException("Role is required.");

        User existing = userRepository.findByEmail(user.getEmail().trim().toLowerCase());
        if (existing != null)
            throw new RuntimeException("That email is already registered.");

        user.setEmail(user.getEmail().trim().toLowerCase());
        user.setName(user.getName().trim());
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        if (email == null || password == null)
            throw new RuntimeException("Email and password are required.");

        User user = userRepository.findByEmail(email.trim().toLowerCase());
        if (user == null)
            throw new RuntimeException("No account found for that email.");
        if (!user.getPassword().equals(password))
            throw new RuntimeException("Incorrect password.");

        return user;
    }
}
