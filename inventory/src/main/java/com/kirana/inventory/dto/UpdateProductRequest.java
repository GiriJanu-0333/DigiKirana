package com.kirana.inventory.dto;

import lombok.Data;

@Data
public class UpdateProductRequest {
  private Long productId;
    private String name;
    private double price;
    private int threshold;
}
