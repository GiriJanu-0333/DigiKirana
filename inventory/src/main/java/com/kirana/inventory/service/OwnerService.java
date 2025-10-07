package com.kirana.inventory.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.kirana.inventory.model.Owner;
import com.kirana.inventory.repository.OwnerRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OwnerService {
     private final OwnerRepository ownerRepository;

    // ✅ Get the only owner record (if exists)
    public Owner getOwner() {
        List<Owner> owners = ownerRepository.findAll();
        return owners.isEmpty() ? null : owners.get(0);
    }

    // ✅ Save owner details (used on first setup)
    public Owner saveOwner(Owner owner) {
        // Allow only one owner
        if (ownerRepository.count() == 0) {
            return ownerRepository.save(owner);
        } else {
            Owner existing = getOwner();
            existing.setName(owner.getName());
            existing.setPhone(owner.getPhone());
            existing.setShopName(owner.getShopName());
            existing.setShopAddress(owner.getShopAddress());
            return ownerRepository.save(existing);
        }
    }

    // ✅ Update owner info (used in profile page)
    public Owner updateOwner(Owner owner) {
        Owner existing = getOwner();
        existing.setName(owner.getName());
        existing.setPhone(owner.getPhone());
        existing.setShopName(owner.getShopName());
        existing.setShopAddress(owner.getShopAddress());
        return ownerRepository.save(existing);
    }
}
