package com.kirana.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kirana.inventory.model.Owner;

public interface OwnerRepository extends JpaRepository<Owner, Long> {
    // This interface will automatically inherit methods for CRUD operations
    // from JpaRepository, such as save, findById, findAll, deleteById, etc.

    
} 
