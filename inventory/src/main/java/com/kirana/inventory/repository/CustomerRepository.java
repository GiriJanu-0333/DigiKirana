package com.kirana.inventory.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kirana.inventory.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // This interface will automatically inherit methods for CRUD operations
    // from JpaRepository, such as save, findById, findAll, deleteById, etc.   

    List<Customer> findByIsDeletedFalse();
    Optional<Customer> findByPhoneAndIsDeletedFalse(String phone);
  Optional<Customer> findByIdAndIsDeletedFalse(Long id);

} 