package com.kirana.inventory.model;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Bill {
@Id
@GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
private Long id;


private LocalDateTime billDate ;

@Column(name = "total_amount")
private BigDecimal totalAmount;

@ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

@OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
private List<BillItem> items= new ArrayList<>();

@Column(name = "deleted")
private boolean deleted = false;


}
