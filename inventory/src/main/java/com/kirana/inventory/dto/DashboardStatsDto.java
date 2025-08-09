package com.kirana.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalProducts;
    private long totalStock;
    private long lowStockCount;
    private long totalBills;
    private double totalSalesAmount;

      private double salesToday;
    private String mostSoldProduct;
    private String topCustomer;
}
