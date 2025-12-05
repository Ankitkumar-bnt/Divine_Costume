package com.rental.divine_costume.dto.responsedto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryReportDto {
    
    private Long categoryId;
    private String categoryName;
    private String categoryDescription;
    
    // Counts
    private Long totalVariants;
    private Long totalCostumes;
    private Long availableCostumes;
    private Long rentedCostumes;
    
    // Financial Metrics
    private BigDecimal totalInventoryValue;
    private BigDecimal averageRentalPrice;
    private BigDecimal potentialMonthlyRevenue; // Based on all costumes being rented
    
    // Utilization
    private Double utilizationRate; // Percentage of costumes currently rented
}
