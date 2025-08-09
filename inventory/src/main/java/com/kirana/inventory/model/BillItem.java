package com.kirana.inventory.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillItem {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;




private int quantity;
private double price; /* price per unit at a time of billing  */
private Double totalPrice; /* total price for this item in the bill */

public Double getTotalPrice() {
    return quantity * price;
}

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "bill_id")
@JsonIgnore
 @ToString.Exclude
private Bill bill;

@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "product_id")
private Product product;
}
