package com.kirana.inventory.controller;

import com.kirana.inventory.dto.DashboardStatsDto;
import com.kirana.inventory.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
   private final DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStatsDto getStats() {
        return dashboardService.getStats();
    }
}
