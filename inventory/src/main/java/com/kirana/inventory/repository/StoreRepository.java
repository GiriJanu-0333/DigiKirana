package com.kirana.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kirana.inventory.model.Store;
public interface StoreRepository extends JpaRepository<Store, Long> {
    // Additional query methods can be defined here if needed

    
} 