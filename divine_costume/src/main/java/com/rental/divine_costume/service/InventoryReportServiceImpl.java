package com.rental.divine_costume.service;

import com.rental.divine_costume.dto.responsedto.CategoryReportDto;
import com.rental.divine_costume.dto.responsedto.DashboardSummaryDto;
import com.rental.divine_costume.dto.responsedto.InventoryReportDto;
import com.rental.divine_costume.entity.items.Costume;
import com.rental.divine_costume.entity.items.CostumeCategory;
import com.rental.divine_costume.entity.items.CostumeVariant;
import com.rental.divine_costume.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class InventoryReportServiceImpl implements InventoryReportService {

    private final CostumeCategoryRepository categoryRepository;
    private final CostumeVariantRepository variantRepository;
    private final CostumeRepository costumeRepository;
    private final CostumeImageRepository imageRepository;
    
    @Value("${app.base-url}")
    private String baseUrl;

    @Override
    public List<InventoryReportDto> getInventoryByVariant() {
        log.info("Generating inventory report grouped by variant");
        
        List<CostumeVariant> variants = variantRepository.findAll();
        List<InventoryReportDto> reports = new ArrayList<>();
        
        for (CostumeVariant variant : variants) {
            List<Costume> costumes = costumeRepository.findByVariantId(variant.getId());
            
            if (costumes.isEmpty()) {
                continue; // Skip variants with no costumes
            }
            
            // Calculate metrics
            long totalCount = costumes.size();
            long availableCount = costumes.stream()
                    .filter(c -> c.getIsRentable() != null && c.getIsRentable())
                    .count();
            long rentedCount = totalCount - availableCount;
            
            // Calculate average prices
            BigDecimal avgPurchasePrice = costumes.stream()
                    .map(Costume::getPurchasePrice)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(totalCount), 2, RoundingMode.HALF_UP);
            
            BigDecimal avgRentalPrice = costumes.stream()
                    .map(Costume::getRentalPricePerDay)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(totalCount), 2, RoundingMode.HALF_UP);
            
            BigDecimal totalValue = costumes.stream()
                    .map(Costume::getPurchasePrice)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Get unique sizes
            int uniqueSizes = (int) costumes.stream()
                    .map(Costume::getSize)
                    .filter(Objects::nonNull)
                    .distinct()
                    .count();
            
            // Get image URL
            String imageUrl = getImageUrl(variant);
            
            InventoryReportDto report = InventoryReportDto.builder()
                    .variantId(variant.getId())
                    .variantDescription(variant.getVariantDescription())
                    .categoryName(variant.getCategory() != null ? variant.getCategory().getCategoryName() : "N/A")
                    .style(variant.getStyle())
                    .primaryColor(variant.getPrimaryColor())
                    .secondaryColor(variant.getSecondaryColor())
                    .tertiaryColor(variant.getTertiaryColor())
                    .totalCount(totalCount)
                    .availableCount(availableCount)
                    .rentedCount(rentedCount)
                    .averagePurchasePrice(avgPurchasePrice)
                    .averageRentalPrice(avgRentalPrice)
                    .totalInventoryValue(totalValue)
                    .uniqueSizes(uniqueSizes)
                    .imageUrl(imageUrl)
                    .build();
            
            reports.add(report);
        }
        
        // Sort by total count descending
        reports.sort((a, b) -> Long.compare(b.getTotalCount(), a.getTotalCount()));
        
        return reports;
    }

    @Override
    public List<InventoryReportDto> getInventoryByVariantAndSize() {
        log.info("Generating inventory report grouped by variant and size");
        
        List<CostumeVariant> variants = variantRepository.findAll();
        List<InventoryReportDto> reports = new ArrayList<>();
        
        for (CostumeVariant variant : variants) {
            List<Costume> allCostumes = costumeRepository.findByVariantId(variant.getId());
            
            // Group by size
            Map<String, List<Costume>> costumesBySize = allCostumes.stream()
                    .collect(Collectors.groupingBy(c -> c.getSize() != null ? c.getSize() : "Unknown"));
            
            for (Map.Entry<String, List<Costume>> entry : costumesBySize.entrySet()) {
                String size = entry.getKey();
                List<Costume> costumes = entry.getValue();
                
                long totalCount = costumes.size();
                long availableCount = costumes.stream()
                        .filter(c -> c.getIsRentable() != null && c.getIsRentable())
                        .count();
                long rentedCount = totalCount - availableCount;
                
                BigDecimal avgPurchasePrice = costumes.stream()
                        .map(Costume::getPurchasePrice)
                        .filter(Objects::nonNull)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                        .divide(BigDecimal.valueOf(totalCount), 2, RoundingMode.HALF_UP);
                
                BigDecimal avgRentalPrice = costumes.stream()
                        .map(Costume::getRentalPricePerDay)
                        .filter(Objects::nonNull)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                        .divide(BigDecimal.valueOf(totalCount), 2, RoundingMode.HALF_UP);
                
                BigDecimal totalValue = costumes.stream()
                        .map(Costume::getPurchasePrice)
                        .filter(Objects::nonNull)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                String imageUrl = getImageUrl(variant);
                
                InventoryReportDto report = InventoryReportDto.builder()
                        .variantId(variant.getId())
                        .variantDescription(variant.getVariantDescription())
                        .categoryName(variant.getCategory() != null ? variant.getCategory().getCategoryName() : "N/A")
                        .style(variant.getStyle())
                        .primaryColor(variant.getPrimaryColor())
                        .secondaryColor(variant.getSecondaryColor())
                        .tertiaryColor(variant.getTertiaryColor())
                        .size(size)
                        .totalCount(totalCount)
                        .availableCount(availableCount)
                        .rentedCount(rentedCount)
                        .averagePurchasePrice(avgPurchasePrice)
                        .averageRentalPrice(avgRentalPrice)
                        .totalInventoryValue(totalValue)
                        .uniqueSizes(1)
                        .imageUrl(imageUrl)
                        .build();
                
                reports.add(report);
            }
        }
        
        // Sort by variant description, then size
        reports.sort(Comparator.comparing(InventoryReportDto::getVariantDescription)
                .thenComparing(InventoryReportDto::getSize));
        
        return reports;
    }

    @Override
    public List<InventoryReportDto> getInventoryByVariantId(Long variantId) {
        log.info("Generating inventory report for variant ID: {}", variantId);
        
        CostumeVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found with ID: " + variantId));
        
        List<Costume> allCostumes = costumeRepository.findByVariantId(variantId);
        List<InventoryReportDto> reports = new ArrayList<>();
        
        // Group by size
        Map<String, List<Costume>> costumesBySize = allCostumes.stream()
                .collect(Collectors.groupingBy(c -> c.getSize() != null ? c.getSize() : "Unknown"));
        
        for (Map.Entry<String, List<Costume>> entry : costumesBySize.entrySet()) {
            String size = entry.getKey();
            List<Costume> costumes = entry.getValue();
            
            long totalCount = costumes.size();
            long availableCount = costumes.stream()
                    .filter(c -> c.getIsRentable() != null && c.getIsRentable())
                    .count();
            long rentedCount = totalCount - availableCount;
            
            BigDecimal avgPurchasePrice = costumes.stream()
                    .map(Costume::getPurchasePrice)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(totalCount), 2, RoundingMode.HALF_UP);
            
            BigDecimal avgRentalPrice = costumes.stream()
                    .map(Costume::getRentalPricePerDay)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(totalCount), 2, RoundingMode.HALF_UP);
            
            BigDecimal totalValue = costumes.stream()
                    .map(Costume::getPurchasePrice)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            String imageUrl = getImageUrl(variant);
            
            InventoryReportDto report = InventoryReportDto.builder()
                    .variantId(variant.getId())
                    .variantDescription(variant.getVariantDescription())
                    .categoryName(variant.getCategory() != null ? variant.getCategory().getCategoryName() : "N/A")
                    .style(variant.getStyle())
                    .primaryColor(variant.getPrimaryColor())
                    .secondaryColor(variant.getSecondaryColor())
                    .tertiaryColor(variant.getTertiaryColor())
                    .size(size)
                    .totalCount(totalCount)
                    .availableCount(availableCount)
                    .rentedCount(rentedCount)
                    .averagePurchasePrice(avgPurchasePrice)
                    .averageRentalPrice(avgRentalPrice)
                    .totalInventoryValue(totalValue)
                    .uniqueSizes(1)
                    .imageUrl(imageUrl)
                    .build();
            
            reports.add(report);
        }
        
        return reports;
    }

    @Override
    public List<CategoryReportDto> getCategoryReport() {
        log.info("Generating category report");
        
        List<CostumeCategory> categories = categoryRepository.findAll();
        List<CategoryReportDto> reports = new ArrayList<>();
        
        for (CostumeCategory category : categories) {
            CategoryReportDto report = buildCategoryReport(category);
            reports.add(report);
        }
        
        // Sort by total costumes descending
        reports.sort((a, b) -> Long.compare(b.getTotalCostumes(), a.getTotalCostumes()));
        
        return reports;
    }

    @Override
    public CategoryReportDto getCategoryReportById(Long categoryId) {
        log.info("Generating category report for category ID: {}", categoryId);
        
        CostumeCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
        
        return buildCategoryReport(category);
    }

    @Override
    public DashboardSummaryDto getDashboardSummary() {
        log.info("Generating dashboard summary");
        
        // Overall counts
        long totalCategories = categoryRepository.count();
        long totalVariants = variantRepository.count();
        List<Costume> allCostumes = costumeRepository.findAll();
        long totalCostumes = allCostumes.size();
        long availableCostumes = allCostumes.stream()
                .filter(c -> c.getIsRentable() != null && c.getIsRentable())
                .count();
        long rentedCostumes = totalCostumes - availableCostumes;
        
        // Financial summary
        BigDecimal totalInventoryValue = allCostumes.stream()
                .map(Costume::getPurchasePrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalPotentialRevenue = allCostumes.stream()
                .map(Costume::getRentalPricePerDay)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .multiply(BigDecimal.valueOf(30)); // Monthly potential
        
        // Top categories by costumes
        Map<String, Long> topCategories = allCostumes.stream()
                .filter(c -> c.getCostumeVariant() != null && c.getCostumeVariant().getCategory() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getCostumeVariant().getCategory().getCategoryName(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
        
        // Top variants by costumes
        Map<String, Long> topVariants = allCostumes.stream()
                .filter(c -> c.getCostumeVariant() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getCostumeVariant().getVariantDescription(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
        
        // Size distribution
        Map<String, Long> sizeDistribution = allCostumes.stream()
                .map(Costume::getSize)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(
                        size -> size,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
        
        // Color distribution
        Map<String, Long> colorDistribution = allCostumes.stream()
                .filter(c -> c.getCostumeVariant() != null && c.getCostumeVariant().getPrimaryColor() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getCostumeVariant().getPrimaryColor(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
        
        // Utilization rate
        double utilizationRate = totalCostumes > 0 
                ? (double) rentedCostumes / totalCostumes * 100 
                : 0.0;
        
        // Low stock variants (less than 5 available)
        long lowStockVariants = variantRepository.findAll().stream()
                .filter(variant -> {
                    long available = costumeRepository.findByVariantId(variant.getId()).stream()
                            .filter(c -> c.getIsRentable() != null && c.getIsRentable())
                            .count();
                    return available > 0 && available < 5;
                })
                .count();
        
        return DashboardSummaryDto.builder()
                .totalCategories(totalCategories)
                .totalVariants(totalVariants)
                .totalCostumes(totalCostumes)
                .availableCostumes(availableCostumes)
                .rentedCostumes(rentedCostumes)
                .totalInventoryValue(totalInventoryValue)
                .totalPotentialMonthlyRevenue(totalPotentialRevenue)
                .topCategoriesByCostumes(topCategories)
                .topVariantsByCostumes(topVariants)
                .sizeDistribution(sizeDistribution)
                .colorDistribution(colorDistribution)
                .overallUtilizationRate(utilizationRate)
                .lowStockVariants(lowStockVariants)
                .build();
    }

    @Override
    public List<InventoryReportDto> getLowStockReport(Integer threshold) {
        log.info("Generating low stock report with threshold: {}", threshold);
        
        int limit = threshold != null ? threshold : 5;
        
        List<InventoryReportDto> allReports = getInventoryByVariantAndSize();
        
        return allReports.stream()
                .filter(report -> report.getAvailableCount() > 0 && report.getAvailableCount() < limit)
                .sorted(Comparator.comparing(InventoryReportDto::getAvailableCount))
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryReportDto> getHighValueInventory(Integer limit) {
        log.info("Generating high value inventory report with limit: {}", limit);
        
        int resultLimit = limit != null ? limit : 10;
        
        List<InventoryReportDto> allReports = getInventoryByVariant();
        
        return allReports.stream()
                .filter(report -> report.getTotalInventoryValue() != null)
                .sorted((a, b) -> b.getTotalInventoryValue().compareTo(a.getTotalInventoryValue()))
                .limit(resultLimit)
                .collect(Collectors.toList());
    }

    // Helper methods
    
    private CategoryReportDto buildCategoryReport(CostumeCategory category) {
        List<CostumeVariant> variants = variantRepository.findByCategoryId(category.getId());
        long totalVariants = variants.size();
        
        List<Costume> allCostumes = new ArrayList<>();
        for (CostumeVariant variant : variants) {
            allCostumes.addAll(costumeRepository.findByVariantId(variant.getId()));
        }
        
        long totalCostumes = allCostumes.size();
        long availableCostumes = allCostumes.stream()
                .filter(c -> c.getIsRentable() != null && c.getIsRentable())
                .count();
        long rentedCostumes = totalCostumes - availableCostumes;
        
        BigDecimal totalValue = allCostumes.stream()
                .map(Costume::getPurchasePrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal avgRentalPrice = BigDecimal.ZERO;
        if (totalCostumes > 0) {
            avgRentalPrice = allCostumes.stream()
                    .map(Costume::getRentalPricePerDay)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(totalCostumes), 2, RoundingMode.HALF_UP);
        }
        
        BigDecimal potentialRevenue = allCostumes.stream()
                .map(Costume::getRentalPricePerDay)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .multiply(BigDecimal.valueOf(30)); // Monthly
        
        double utilizationRate = totalCostumes > 0 
                ? (double) rentedCostumes / totalCostumes * 100 
                : 0.0;
        
        return CategoryReportDto.builder()
                .categoryId(category.getId())
                .categoryName(category.getCategoryName())
                .categoryDescription(category.getCategoryDescription())
                .totalVariants(totalVariants)
                .totalCostumes(totalCostumes)
                .availableCostumes(availableCostumes)
                .rentedCostumes(rentedCostumes)
                .totalInventoryValue(totalValue)
                .averageRentalPrice(avgRentalPrice)
                .potentialMonthlyRevenue(potentialRevenue)
                .utilizationRate(utilizationRate)
                .build();
    }
    
    private String getImageUrl(CostumeVariant variant) {
        if (variant.getImages() != null && !variant.getImages().isEmpty()) {
            String imagePath = variant.getImages().get(0).getImageUrl();
            if (imagePath != null && !imagePath.trim().isEmpty()) {
                return baseUrl + "/api/files/display?path=" + imagePath;
            }
        }
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGOUZBIiBzdHJva2U9IiNEREREREQiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0yMSAxNS02LTYtNiA2Ii8+CjxwYXRoIGQ9Im05IDlhMyAzIDAgMSAwIDYgMGEzIDMgMCAwIDAtNiAweiIvPgo8L3N2Zz4KPC9zdmc+";
    }
}
