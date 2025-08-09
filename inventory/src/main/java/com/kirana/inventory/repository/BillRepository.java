package com.kirana.inventory.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kirana.inventory.model.Bill;
 
import com.kirana.inventory.model.Customer;

public interface BillRepository extends JpaRepository<Bill, Long> {
 
  List<Bill> findByCustomer(Customer customer);
 
   List<Bill> findByCustomerId(Long customerId);

      List<Bill> findByBillDateBetween(LocalDateTime start, LocalDateTime end);


      List<Bill> findByCustomerAndDeletedFalse(Customer customer);
    
    List<Bill> findByDeletedFalse();
    
    Optional<Bill> findByIdAndDeletedFalse(Long id);

    @Query("SELECT b FROM Bill b WHERE DATE(b.billDate) BETWEEN :start AND :end")
List<Bill> findByBillDateBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);


@Query("SELECT b FROM Bill b LEFT JOIN FETCH b.items WHERE b.id = :id")
Optional<Bill> findByIdWithItems(@Param("id") Long id);


}
