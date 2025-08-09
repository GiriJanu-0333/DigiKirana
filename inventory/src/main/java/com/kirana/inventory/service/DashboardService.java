package com.kirana.inventory.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.kirana.inventory.dto.DashboardStatsDto;
import com.kirana.inventory.model.Bill;
import com.kirana.inventory.model.BillItem;
import com.kirana.inventory.repository.BillRepository;
import com.kirana.inventory.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ProductRepository productRepository;
    private final BillRepository billRepository;

    public DashboardStatsDto getStats() {
        long totalProducts = productRepository.count();
        long totalStock = productRepository.findAll().stream()
                .mapToLong(p -> p.getQuantity()).sum();
        long lowStockCount = productRepository.findAll().stream()
                .filter(p -> p.getQuantity() < p.getThreshold())
                .count();

        List<Bill> bills = billRepository.findAll();

        long totalBills = billRepository.count();
        double totalSalesAmount = billRepository.findAll().stream()
               .mapToDouble(b -> b.getTotalAmount().doubleValue()).sum();


        // 🔸 Sales Today
        LocalDate today = LocalDate.now();
        double salesToday = bills.stream()
                .filter(b -> b.getBillDate().toLocalDate().isEqual(today))
                .mapToDouble(b -> b.getTotalAmount().doubleValue()).sum();

        // 🔸 Most Sold Product
        Map<String, Integer> productSales = new HashMap<>();
        for (Bill bill : bills) {
            for (BillItem item : bill.getItems()) {
                String name = item.getProduct().getName();
                productSales.put(name, productSales.getOrDefault(name, 0) + item.getQuantity());
            }
        }
        String mostSoldProduct = productSales.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        // 🔸 Top Customer
        Map<String, Double> customerSpend = new HashMap<>();
        for (Bill bill : bills) {
            String name = bill.getCustomer().getName();
            customerSpend.put(name, customerSpend.getOrDefault(name, 0.0) + bill.getTotalAmount().doubleValue());
        }
        String topCustomer = customerSpend.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        return new DashboardStatsDto(
                totalProducts,
                totalStock,
                lowStockCount,
                totalBills,
                totalSalesAmount,
                salesToday,
                mostSoldProduct,
                topCustomer);

    }
}
