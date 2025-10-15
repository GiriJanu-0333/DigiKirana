package com.kirana.inventory.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kirana.inventory.model.Store;
import com.kirana.inventory.service.StoreService;
@RestController
@RequestMapping("/api/store")
@CrossOrigin
public class StoreController {
    
    @Autowired
    private StoreService storeService;

    @PostMapping
    public Store saveOrUpdateStore(@RequestBody Store store) {
        return storeService.saveOrUpdateStore(store);
    }

    @GetMapping
    public List<Store> getAllStores() {
        return storeService.getAllStores();
    }

    @GetMapping("/{id}")
    public Store getStoreById(@PathVariable Long id) {
        return storeService.getStoreById(id);
    }
}
