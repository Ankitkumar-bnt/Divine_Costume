import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Category {
  id: number;
  categoryName: string;
  categoryDescription?: string;
}

export interface VariantDescription {
  id: number;
  category?: any; // CostumeCategory object
  variantDescription: string;
  style?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
}

export interface Size {
  id: number;
  variantId: number;
  size: string;
  availableCount: number;
}

export interface CostumeInventory {
  id: number;
  categoryId?: number;
  variantId?: number;
  categoryName: string;
  variantDescription: string;
  size: string;
  count: number;
  imageUrl: string;
  serialNumbers: string[];
}

export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly API_BASE = '/api/costume-inventory';
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  
  public toast$ = this.toastSubject.asObservable();

  constructor(private http: HttpClient) {}

  // API Methods with enhanced error handling
  getCategories(): Observable<Category[]> {
    console.log('🔍 Fetching categories from:', `${this.API_BASE}/categories`);
    return this.http.get<Category[]>(`${this.API_BASE}/categories`).pipe(
      tap(response => {
        console.log('✅ Categories response:', response);
        console.log('📊 Response type:', typeof response);
        console.log('📋 Is Array:', Array.isArray(response));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Categories API Error Details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error,
          headers: error.headers
        });
        
        // If status is 200 but treated as error, it might be a parsing issue
        if (error.status === 200) {
          console.warn('⚠️ Status 200 but treated as error - likely response format issue');
          console.log('📄 Raw response body:', error.error);
        }
        
        throw error;
      })
    );
  }

  getVariantsByCategory(categoryId: number): Observable<VariantDescription[]> {
    console.log('🔍 Fetching variants for category:', categoryId);
    return this.http.get<VariantDescription[]>(`${this.API_BASE}/variants/category/${categoryId}`).pipe(
      tap(response => console.log('✅ Variants response:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Variants API Error:', error);
        throw error;
      })
    );
  }

  getSizeCountsByVariant(variantId: number): Observable<{[key: string]: number}> {
    console.log('🔍 Fetching sizes for variant:', variantId);
    return this.http.get<{[key: string]: any}>(`${this.API_BASE}/size-counts/variant/${variantId}`).pipe(
      tap(response => {
        console.log('✅ Sizes response:', response);
        console.log('📊 Response type:', typeof response);
        console.log('📋 Response keys:', Object.keys(response));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Sizes API Error:', error);
        if (error.status === 200) {
          console.warn('⚠️ Status 200 but treated as error - likely response format issue');
          console.log('📄 Raw response body:', error.error);
        }
        throw error;
      })
    );
  }

  saveCostumePart(partData: any): Observable<number> {
    return this.http.post<number>(`${this.API_BASE}/costume-parts`, partData);
  }

  updateInventoryCount(inventoryId: number, count: number): Observable<any> {
    return this.http.put(`${this.API_BASE}/inventory/${inventoryId}/count/${count}`, {});
  }

  getInventoryByCategory(categoryId: number): Observable<CostumeInventory[]> {
    return this.http.get<CostumeInventory[]>(`${this.API_BASE}/inventory/category/${categoryId}`);
  }

  getInventoryByVariant(variantId: number): Observable<CostumeInventory[]> {
    return this.http.get<CostumeInventory[]>(`${this.API_BASE}/inventory/variant/${variantId}`);
  }

  getInventoryByVariantAndSize(variantId: number, size: string): Observable<CostumeInventory[]> {
    return this.http.get<CostumeInventory[]>(`${this.API_BASE}/inventory/variant/${variantId}/size/${encodeURIComponent(size)}`);
  }

  getSerialNumbersByVariantAndSize(variantId: number, size: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_BASE}/serial-numbers/variant/${variantId}/size/${encodeURIComponent(size)}`);
  }

  // Utility Methods
  mapSizeCounts(sizeCounts: {[key: string]: number}, variantId: number): Size[] {
    return Object.entries(sizeCounts).map(([size, count], index) => ({
      id: variantId * 1000 + index, // Generate consistent ID based on variant
      variantId: variantId,
      size: size,
      availableCount: count
    }));
  }

  dedupeCategoriesByName(categories: Category[]): Category[] {
    const seen = new Set<string>();
    return categories.filter(c => {
      const key = (c.categoryName || '').trim().toLowerCase();
      if (seen.has(key)) { return false; }
      seen.add(key);
      return true;
    });
  }

  dedupeVariantsByDescription(variants: VariantDescription[]): VariantDescription[] {
    const seen = new Set<string>();
    return variants.filter(v => {
      const key = (v.variantDescription || '').trim().toLowerCase();
      if (seen.has(key)) { return false; }
      seen.add(key);
      return true;
    });
  }

  findExistingInventoryItem(
    inventoryData: CostumeInventory[], 
    categoryId: number, 
    variantId: number, 
    size: string
  ): CostumeInventory | undefined {
    return inventoryData.find(item => 
      item.categoryId === categoryId && 
      item.variantId === variantId && 
      item.size === size
    );
  }

  generateSerialNumbers(count: number, prefix: string = 'SN'): string[] {
    const timestamp = Date.now();
    return Array.from({ length: count }, (_, i) => `${prefix}${timestamp}${String(i).padStart(3, '0')}`);
  }

  calculateNewTotal(currentCount: number, inputCount: number): number {
    return Math.max(0, currentCount + inputCount);
  }

  // Toast Methods
  showToast(message: string, type: ToastMessage['type'] = 'info', duration: number = 3000): void {
    this.toastSubject.next({ message, type, duration });
    
    // Auto-clear toast after duration
    setTimeout(() => {
      this.toastSubject.next(null);
    }, duration);
  }

  showSuccess(message: string): void {
    this.showToast(message, 'success');
  }

  showError(message: string): void {
    this.showToast(message, 'error', 5000);
  }

  showInfo(message: string): void {
    this.showToast(message, 'info');
  }

  clearToast(): void {
    this.toastSubject.next(null);
  }
}
