package com.kirana.inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kirana.inventory.model.Owner;
import com.kirana.inventory.service.OwnerService;

import lombok.RequiredArgsConstructor;



@CrossOrigin(origins = "http://localhost:3000") // adjust for your frontend
@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerController {
       private final OwnerService ownerService;

    // ✅ Get owner details
    @GetMapping
    public ResponseEntity<Owner> getOwner() {
        Owner owner = ownerService.getOwner();
        if (owner == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(owner);
    }

    // ✅ Save owner (first time setup)
    @PostMapping
    public ResponseEntity<Owner> saveOwner(@RequestBody Owner owner) {
        return ResponseEntity.ok(ownerService.saveOwner(owner));
    }

    // ✅ Update owner profile
    @PutMapping
    public ResponseEntity<Owner> updateOwner(@RequestBody Owner owner) {
        return ResponseEntity.ok(ownerService.updateOwner(owner));
    }
}
