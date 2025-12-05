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
public class InventoryReportDto {
    
    // Variant Information
    private Long variantId;
    private String variantDescription;
    private String categoryName;
    private String style;
    private String primaryColor;
    private String secondaryColor;
    private String tertiaryColor;
    
    // Size Information
    private String size;
    
    // Counts
    private Long totalCount;
    private Long availableCount;
    private Long rentedCount;
    
    // Financial Information
    private BigDecimal averagePurchasePrice;
    private BigDecimal averageRentalPrice;
    private BigDecimal totalInventoryValue;
    
    // Additional Metrics
    private Integer uniqueSizes;
    private String imageUrl;
}
