package com.kirana.inventory.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kirana.inventory.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // Option 1: if username is unique
    Optional<User> findByUsername(String username);

    // Option 2: if multiple users can have same username
    List<User> findAllByUsername(String username);
}