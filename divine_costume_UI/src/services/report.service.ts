import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// DTOs matching backend
export interface InventoryReportDto {
    variantId: number;
    variantDescription: string;
    categoryName: string;
    style: string;
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    size: string;
    totalCount: number;
    availableCount: number;
    rentedCount: number;
    averagePurchasePrice: number;
    averageRentalPrice: number;
    totalInventoryValue: number;
    uniqueSizes: number;
    imageUrl: string;
}

export interface CategoryReportDto {
    categoryId: number;
    categoryName: string;
    categoryDescription: string;
    totalVariants: number;
    totalCostumes: number;
    availableCostumes: number;
    rentedCostumes: number;
    totalInventoryValue: number;
    averageRentalPrice: number;
    potentialMonthlyRevenue: number;
    utilizationRate: number;
}

export interface DashboardSummaryDto {
    totalCategories: number;
    totalVariants: number;
    totalCostumes: number;
    availableCostumes: number;
    rentedCostumes: number;
    totalInventoryValue: number;
    totalPotentialMonthlyRevenue: number;
    topCategoriesByCostumes: { [key: string]: number };
    topVariantsByCostumes: { [key: string]: number };
    sizeDistribution: { [key: string]: number };
    colorDistribution: { [key: string]: number };
    overallUtilizationRate: number;
    lowStockVariants: number;
}

export interface MessageResponse<T> {
    status: string;
    message: string;
    data: T;
    timestamp: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private baseUrl = 'http://localhost:8080/item/report';

    constructor(private http: HttpClient) { }

    /**
     * Get dashboard summary with overall statistics
     */
    getDashboardSummary(): Observable<DashboardSummaryDto> {
        return this.http.get<MessageResponse<DashboardSummaryDto>>(`${this.baseUrl}/dashboard`)
            .pipe(map(response => response.data));
    }

    /**
     * Get inventory report grouped by variant
     */
    getInventoryByVariant(): Observable<InventoryReportDto[]> {
        return this.http.get<MessageResponse<InventoryReportDto[]>>(`${this.baseUrl}/inventory/by-variant`)
            .pipe(map(response => response.data));
    }

    /**
     * Get inventory report grouped by variant and size
     */
    getInventoryByVariantAndSize(): Observable<InventoryReportDto[]> {
        return this.http.get<MessageResponse<InventoryReportDto[]>>(`${this.baseUrl}/inventory/by-variant-size`)
            .pipe(map(response => response.data));
    }

    /**
     * Get inventory report for a specific variant
     */
    getInventoryByVariantId(variantId: number): Observable<InventoryReportDto[]> {
        return this.http.get<MessageResponse<InventoryReportDto[]>>(`${this.baseUrl}/inventory/variant/${variantId}`)
            .pipe(map(response => response.data));
    }

    /**
     * Get category-level report
     */
    getCategoryReport(): Observable<CategoryReportDto[]> {
        return this.http.get<MessageResponse<CategoryReportDto[]>>(`${this.baseUrl}/category`)
            .pipe(map(response => response.data));
    }

    /**
     * Get category report for a specific category
     */
    getCategoryReportById(categoryId: number): Observable<CategoryReportDto> {
        return this.http.get<MessageResponse<CategoryReportDto>>(`${this.baseUrl}/category/${categoryId}`)
            .pipe(map(response => response.data));
    }

    /**
     * Get low stock report
     */
    getLowStockReport(threshold: number = 5): Observable<InventoryReportDto[]> {
        return this.http.get<MessageResponse<InventoryReportDto[]>>(`${this.baseUrl}/low-stock?threshold=${threshold}`)
            .pipe(map(response => response.data));
    }

    /**
     * Get high value inventory report
     */
    getHighValueInventory(limit: number = 10): Observable<InventoryReportDto[]> {
        return this.http.get<MessageResponse<InventoryReportDto[]>>(`${this.baseUrl}/high-value?limit=${limit}`)
            .pipe(map(response => response.data));
    }
}
