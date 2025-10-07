package com.kirana.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BillResponseDto {
       private Long id;
    private String customerName;
    private String customerPhone;
    private BigDecimal totalAmount;
    private LocalDateTime billDate;
}
