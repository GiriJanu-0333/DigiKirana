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

    // public List<Customer> getAllCustomers() {
    //     return customerRepository.findAll();
    // }

    public List<Customer> getAllCustomers() {
    return customerRepository.findByIsDeletedFalse();
}
// public Optional<Customer> getCustomerByPhone(String phone) {
//     return customerRepository.findByPhone(phone);
// }

public Optional<Customer> getCustomerByPhone(String phone) {
    return customerRepository.findByPhoneAndIsDeletedFalse(phone);
}


    // public Optional<Customer> getCustomerById(Long id) {
    //     return customerRepository.findById(id);
    // }

    public Optional<Customer> getCustomerById(Long id) {
    return customerRepository.findByIdAndIsDeletedFalse(id);
}


    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        return customerRepository.findById(id).map(customer -> {
            customer.setName(updatedCustomer.getName());
            customer.setPhone(updatedCustomer.getPhone());
            customer.setAddress(updatedCustomer.getAddress());
            return customerRepository.save(customer);
        }).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

// public void deleteCustomer(Long id) {
//     if (!customerRepository.existsById(id)) {
//         throw new RuntimeException("Customer not found with id: " + id);
//     }
//     customerRepository.deleteById(id);
// }
public void deleteCustomer(Long id) {
    Customer customer = customerRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    
    customer.setDeleted(true); // soft delete
    customerRepository.save(customer); // save the change
}


//     public Optional<Customer> getCustomerByPhone(String phone) {
//     return customerRepository.findByPhone(phone);
// }

public Customer createCustomer(Customer customer) {
    customerRepository.findByPhoneAndIsDeletedFalse(customer.getPhone()).ifPresent(existing -> {
        throw new RuntimeException("Phone number already exists");
    });
    return customerRepository.save(customer);
}

}
