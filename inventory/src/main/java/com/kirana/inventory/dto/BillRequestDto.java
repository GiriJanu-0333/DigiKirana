package com.kirana.inventory.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

 @Data
@NoArgsConstructor
@AllArgsConstructor
public class BillRequestDto {
    // private Long customerId;
    private String customerName;
    private String customerPhone;
    private List<ItemRequest> items;

    @Data
    public static class ItemRequest {
        private Long productId;
        private int quantity;
    }
}
