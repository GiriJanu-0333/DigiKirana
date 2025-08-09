package com.kirana.inventory.dto;

import lombok.Data;

@Data
public class AddStockRequest {
    private Long productId;
    private int quantityToAdd;
}
