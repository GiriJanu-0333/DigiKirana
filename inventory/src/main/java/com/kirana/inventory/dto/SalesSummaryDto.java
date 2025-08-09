package com.kirana.inventory.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesSummaryDto {
      private BigDecimal totalSalesAmount;
    private long totalBills;
    private int totalItemsSold;
}
