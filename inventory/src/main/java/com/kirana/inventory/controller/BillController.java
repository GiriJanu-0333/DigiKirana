package com.kirana.inventory.controller;

import java.io.OutputStream;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kirana.inventory.dto.BillRequestDto;
import com.kirana.inventory.dto.BillResponseDto;
import com.kirana.inventory.dto.SalesSummaryDto;
import com.kirana.inventory.model.Bill;
import com.kirana.inventory.service.BillService;
import com.kirana.inventory.service.PdfService;
import com.kirana.inventory.service.ProductService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/bills")
public class BillController {
  
    private final BillService billService;

     private final ProductService productService;
  
private final PdfService pdfService;

// ✅ Create new bill
 @PostMapping
public ResponseEntity<Bill> createBill(@RequestBody BillRequestDto billRequestDto) {
      Bill savedBill = billService.createBill(billRequestDto);
    return ResponseEntity.ok(savedBill);
}

    // ✅ Get bill by ID
    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        Bill bill = billService.getBillById(id);

        return ResponseEntity.ok(bill);
    }
    // ✅ Get all bills
    // @GetMapping
    // public ResponseEntity<List<Bill>> getAllBills() {
    //     return ResponseEntity.ok(billService.getAllBills());
    // }
    @GetMapping
public List<BillResponseDto> getAllBills() {
    return billService.getAllBills();
}


    // ✅ Get bills by customer
    @GetMapping("/by-customer/{customerId}")
    public ResponseEntity<List<Bill>> getBillsByCustomer(@PathVariable Long customerId) {
        List<Bill> bills = billService.getBillsByCustomer(customerId);
        return ResponseEntity.ok(bills);
    }


    // ✅ Get bills by date range
@GetMapping("/date-range")
public ResponseEntity<List<Bill>> getBillsByDateRange(
    @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
    @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

    List<Bill> bills = billService.getBillsByDateRange(startDate, endDate);
    return ResponseEntity.ok(bills);
}

// ✅ Get sales summary
@GetMapping("/summary")
public ResponseEntity<SalesSummaryDto> getSalesSummary() {
    return ResponseEntity.ok(billService.getSalesSummary());
}

// ✅ Soft delete bill
@DeleteMapping("/{id}")
public ResponseEntity<String> deleteBill(@PathVariable Long id) {
    billService.softDeleteBill(id);
    return ResponseEntity.ok("Bill deleted (soft)");
}

// ✅ Export bill to PDF
@GetMapping("/{billId}/export/pdf")
public void exportBillToPdf(@PathVariable Long billId, HttpServletResponse response) {
    Bill bill = billService.getCompleteBillForPdf(billId);  // ✅ uses JOIN FETCH to load items

    byte[] pdfBytes = pdfService.generateBillPdf(bill);

    try {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=bill_" + billId + ".pdf");
        OutputStream os = response.getOutputStream();
        os.write(pdfBytes);
        os.flush();
    } catch (Exception e) {
        throw new RuntimeException("Failed to write PDF to response", e);
    }

    System.out.println("Bill Items: " + bill.getItems());
}

// @GetMapping("/recent")
// public ResponseEntity<List<Bill>> getRecentBills() {
//     return ResponseEntity.ok(billService.getRecentBills(5)); // limit to 5
// }



}
