import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface CostumeProduct {
    id: number;
    name: string;
    description: string;
    pricePerDay: number;
    images: string[];
    category: string;
    size: string;
    color: string;
    fabric: string;
    gender: 'men' | 'women' | 'unisex';
    rentedCount: number;
    createdAt: string;
    available?: boolean;
    deposit?: number;
}

export interface CostumeVariantDetail {
    colorKey: string;
    displayName: string;
    thumbnail: string;
    images: string[];
    rentPerDay: number;
    deposit: number;
    sizes: { size: string; stock: number }[];
}

export interface CostumeDetailModel {
    id: number;
    name: string;
    shortDescription: string;
    variants: CostumeVariantDetail[];
}

export interface BackendItemResponse {
    categoryId: number;
    categoryName: string;
    categoryDescription: string;
    variantId: number;
    variantDescription: string;
    style: string;
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    costumeId: number;
    numberOfItems: number;
    size: string;
    serialNumber: number;
    purchasePrice: number;
    rentalPricePerDay: number;
    deposit: number;
    isRentable: boolean;
    items: Array<{ id: number; itemName: string; rentalPricePerDay: number; deposit: number; imageUrl: string }>;
    images: Array<{ id: number; imageUrl: string }>;
}

@Injectable({
    providedIn: 'root'
})
export class CostumeService {
    private apiUrl = 'http://localhost:8080/items';

    constructor(private http: HttpClient) { }

    /**
     * Fetch all costumes from backend and transform to CostumeProduct format
     */
    getAllCostumes(): Observable<CostumeProduct[]> {
        return this.http.get<BackendItemResponse[]>(`${this.apiUrl}/getAll`).pipe(
            map(items => this.transformToCostumeProducts(items))
        );
    }

    /**
     * Get costume detail by ID
     */
    getCostumeDetail(id: number): Observable<CostumeDetailModel | null> {
        return this.http.get<BackendItemResponse[]>(`${this.apiUrl}/getAll`).pipe(
            map(items => this.transformToCostumeDetail(items, id))
        );
    }

    /**
     * Get unique filter options from all costumes
     */
    getFilterOptions(): Observable<{
        categories: string[];
        sizes: string[];
        colors: string[];
    }> {
        return this.http.get<BackendItemResponse[]>(`${this.apiUrl}/getAll`).pipe(
            map(items => {
                const categories = new Set<string>();
                const sizes = new Set<string>();
                const colors = new Set<string>();

                items.forEach(item => {
                    if (item.categoryName) categories.add(item.categoryName);
                    if (item.size) sizes.add(item.size);
                    if (item.primaryColor) colors.add(item.primaryColor);
                });

                return {
                    categories: Array.from(categories).sort(),
                    sizes: Array.from(sizes).sort(),
                    colors: Array.from(colors).sort()
                };
            })
        );
    }

    /**
     * Transform backend items to CostumeProduct format for list view
     */
    private transformToCostumeProducts(items: BackendItemResponse[]): CostumeProduct[] {
        // Group by variant to avoid duplicates
        const variantMap = new Map<number, BackendItemResponse>();

        items.forEach(item => {
            if (!variantMap.has(item.variantId)) {
                variantMap.set(item.variantId, item);
            }
        });

        return Array.from(variantMap.values()).map(item => ({
            id: item.costumeId,
            name: `${item.categoryName} ${item.style || ''}`.trim(),
            description: item.variantDescription || item.categoryDescription || '',
            pricePerDay: item.rentalPricePerDay,
            images: item.images?.map(img => this.getImageUrl(img.imageUrl)) || [],
            category: item.categoryName,
            size: item.size,
            color: item.primaryColor,
            fabric: item.style || 'Cotton Blend',
            gender: this.determineGender(item.categoryName),
            rentedCount: Math.floor(Math.random() * 300), // TODO: Add actual rental count from backend
            createdAt: new Date().toISOString().split('T')[0],
            available: item.isRentable,
            deposit: item.deposit
        }));
    }

    /**
     * Transform backend items to CostumeDetailModel for detail view
     */
    private transformToCostumeDetail(items: BackendItemResponse[], costumeId: number): CostumeDetailModel | null {
        // Find all items with matching costumeId or variantId
        const relatedItems = items.filter(item => item.costumeId === costumeId);

        if (relatedItems.length === 0) {
            // Fallback: try to find by index
            const item = items[costumeId - 1];
            if (!item) return null;
            relatedItems.push(item);
        }

        const firstItem = relatedItems[0];

        // Group by color variant
        const colorVariants = new Map<string, BackendItemResponse[]>();
        relatedItems.forEach(item => {
            const colorKey = item.primaryColor;
            if (!colorVariants.has(colorKey)) {
                colorVariants.set(colorKey, []);
            }
            colorVariants.get(colorKey)!.push(item);
        });

        const variants: CostumeVariantDetail[] = Array.from(colorVariants.entries()).map(([color, variantItems]) => {
            const firstVariant = variantItems[0];

            // Group sizes and calculate stock
            const sizeMap = new Map<string, number>();
            variantItems.forEach(item => {
                const currentStock = sizeMap.get(item.size) || 0;
                sizeMap.set(item.size, currentStock + 1); // Each item represents 1 stock
            });

            const sizes = Array.from(sizeMap.entries()).map(([size, stock]) => ({
                size,
                stock
            }));

            return {
                colorKey: color.toLowerCase(),
                displayName: color,
                thumbnail: firstVariant.images?.[0] ? this.getImageUrl(firstVariant.images[0].imageUrl) : '',
                images: firstVariant.images?.map(img => this.getImageUrl(img.imageUrl)) || [],
                rentPerDay: firstVariant.rentalPricePerDay,
                deposit: firstVariant.deposit,
                sizes
            };
        });

        return {
            id: costumeId,
            name: `${firstItem.categoryName} ${firstItem.style || ''}`.trim(),
            shortDescription: firstItem.variantDescription || firstItem.categoryDescription || '',
            variants
        };
    }

    /**
     * Convert relative image URL to absolute URL
     */
    private getImageUrl(url: string): string {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        // Assuming images are served from backend at /uploads
        return `http://localhost:8080/${url.startsWith('/') ? url.substring(1) : url}`;
    }

    /**
     * Determine gender based on category name
     */
    private determineGender(categoryName: string): 'men' | 'women' | 'unisex' {
        const lower = categoryName.toLowerCase();
        if (lower.includes('men') || lower.includes('male')) return 'men';
        if (lower.includes('women') || lower.includes('female')) return 'women';
        return 'unisex';
    }
}
