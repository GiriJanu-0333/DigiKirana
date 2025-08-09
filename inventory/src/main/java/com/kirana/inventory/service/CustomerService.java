package com.kirana.inventory.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.kirana.inventory.model.Customer;
import com.kirana.inventory.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;


    //    public Customer createCustomer(Customer customer) {
    //     return customerRepository.save(customer);
    // }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        return customerRepository.findById(id).map(customer -> {
            customer.setName(updatedCustomer.getName());
            customer.setPhone(updatedCustomer.getPhone());
            customer.setAddress(updatedCustomer.getAddress());
            return customerRepository.save(customer);
        }).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public Optional<Customer> getCustomerByPhone(String phone) {
    return customerRepository.findByPhone(phone);
}

public Customer createCustomer(Customer customer) {
    customerRepository.findByPhone(customer.getPhone()).ifPresent(existing -> {
        throw new RuntimeException("Phone number already exists");
    });
    return customerRepository.save(customer);
}

}
