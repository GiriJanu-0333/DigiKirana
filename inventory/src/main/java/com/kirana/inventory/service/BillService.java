package com.kirana.inventory.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.kirana.inventory.dto.BillRequestDto;
import com.kirana.inventory.dto.BillResponseDto;
import com.kirana.inventory.dto.SalesSummaryDto;
import com.kirana.inventory.model.Bill;
import com.kirana.inventory.model.BillItem;
import com.kirana.inventory.model.Customer;
import com.kirana.inventory.model.Product;
import com.kirana.inventory.repository.BillItemRepository;
import com.kirana.inventory.repository.BillRepository;
import com.kirana.inventory.repository.CustomerRepository;
import com.kirana.inventory.repository.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class BillService {

    private final BillRepository billRepository;
    private final BillItemRepository billItemRepository;

    private final ProductRepository productRepository;

    private final CustomerRepository customerRepository;

    @Transactional
    public Bill createBill(BillRequestDto billRequestDto) {
        List<BillRequestDto.ItemRequest> items = billRequestDto.getItems();
        Map<Long, Integer> productIdToQuantity = new HashMap<>();
        for (BillRequestDto.ItemRequest item : items) {
            productIdToQuantity.merge(item.getProductId(), item.getQuantity(), Integer::sum);
        }

        // Step 2: Fetch/Create Customer
        Customer customer = customerRepository
                .findByPhoneAndIsDeletedFalse(billRequestDto.getCustomerPhone())
                .orElseGet(() -> {
                    Customer newCustomer = new Customer();
                    newCustomer.setName(billRequestDto.getCustomerName());
                    newCustomer.setPhone(billRequestDto.getCustomerPhone());
                    return customerRepository.save(newCustomer);
                });

        List<BillItem> billItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // Prepare items and update stock
        for (Map.Entry<Long, Integer> entry : productIdToQuantity.entrySet()) {
            Long productId = entry.getKey();
            Integer quantity = entry.getValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

            if (product.getQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            // Reduce stock
            product.setQuantity(product.getQuantity() - quantity);
            productRepository.save(product);

            BigDecimal itemTotal = BigDecimal.valueOf(product.getPrice()).multiply(BigDecimal.valueOf(quantity)); // ✅
                                                                                                                  // CORRECT

            // Create BillItem
            BillItem billItem = new BillItem();

            billItem.setProduct(product);
            billItem.setQuantity(quantity);
            billItem.setPrice(product.getPrice());
            billItem.setTotalPrice(itemTotal.doubleValue());

            totalAmount = totalAmount.add(itemTotal);
            billItems.add(billItem);
        }

        // Step 3: Create bill
        Bill bill = new Bill();
        bill.setCustomer(customer);
        bill.setBillDate(LocalDateTime.now());

        bill.setDeleted(false);
        bill.setTotalAmount(totalAmount); // ✅ CORRECT
        bill = billRepository.save(bill);

        // Set bill for each item
        for (BillItem item : billItems) {
            item.setBill(bill);
        }
        bill.setItems(billItems);

        billItemRepository.saveAll(billItems); // ✅ Save all items linked to the bill
        return billRepository.findByIdWithItems(bill.getId())
                .orElseThrow(() -> new RuntimeException("Failed to fetch saved bill"));

    }

public Bill getBillById(Long id) {
    return billRepository.findByIdWithItems(id)
        .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
}

// public List<Bill> getAllBills() {
//     return billRepository.findAll();
// }
public List<BillResponseDto> getAllBills() {
    List<Bill> bills = billRepository.findAll();
    List<BillResponseDto> dtos = new ArrayList<>();

    for (Bill bill : bills) {
        BillResponseDto dto = new BillResponseDto();
        dto.setId(bill.getId());
        if (bill.getCustomer() != null) {
            dto.setCustomerName(bill.getCustomer().getName());
            dto.setCustomerPhone(bill.getCustomer().getPhone());
        }
        dto.setTotalAmount(bill.getTotalAmount());
        dto.setBillDate(bill.getBillDate());
        dtos.add(dto);
    }

    return dtos;
}


public List<Bill> getBillsByCustomer(Long customerId) {
    return billRepository.findByCustomerId(customerId);
}

public void softDeleteBill(Long billId) {
    Bill bill = billRepository.findById(billId)
        .orElseThrow(() -> new RuntimeException("Bill not found"));
    bill.setDeleted(true); // ✅ Mark as deleted
    billRepository.save(bill);
}

public List<Bill> getBillsByDateRange(LocalDate startDate, LocalDate endDate) {
    return billRepository.findByBillDateBetween(startDate, endDate);
}

public SalesSummaryDto getSalesSummary() {
    List<Bill> bills = billRepository.findAll();

    BigDecimal totalSales = bills.stream()
        .map(Bill::getTotalAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    long totalBills = bills.size();

    int totalItemsSold = bills.stream()
        .flatMap(bill -> bill.getItems().stream())
        .mapToInt(BillItem::getQuantity)
        .sum();

    return new SalesSummaryDto(totalSales, totalBills, totalItemsSold);
}
public Bill getCompleteBillForPdf(Long billId) {
    return billRepository.findByIdWithItems(billId)
        .orElseThrow(() -> new RuntimeException("Bill not found with id: " + billId));
}

}