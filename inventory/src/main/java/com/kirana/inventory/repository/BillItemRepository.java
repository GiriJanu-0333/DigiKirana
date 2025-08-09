package com.kirana.inventory.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kirana.inventory.model.Bill;
import com.kirana.inventory.model.BillItem;
import com.kirana.inventory.model.Customer;


public interface BillItemRepository extends JpaRepository<BillItem, Long> {

 List<BillItem> findByBillCustomer(Customer customer);

    List<BillItem> findByBill(Bill bill);

 

}
