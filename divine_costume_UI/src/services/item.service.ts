import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Request DTOs expected by backend
export interface CostumeCategoryRequestDto {
  categoryName: string;
  categoryDescription: string;
}

export interface CostumeVariantRequestDto {
  variantDescription: string;
  style: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

export interface CostumeRequestDto {
  numberOfItems: number;
  size: string;
  serialNumber: number;
  purchasePrice: number;
  rentalPricePerDay: number;
  deposit: number;
  isRentable: boolean;
}

export interface CostumeItemRequestDto {
  itemName: string;
  rentalPricePerDay: number;
  deposit: number;
  imageUrl: string;
}

export interface CostumeImageRequestDto {
  imageUrl: string;
}

export interface ItemRequestDto {
  category: CostumeCategoryRequestDto;
  variant: CostumeVariantRequestDto;
  costume: CostumeRequestDto;
  items: CostumeItemRequestDto[];
  images: CostumeImageRequestDto[];
}

// Response DTO aligned with backend
export interface ItemResponseDto {
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

export interface MessageResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8080/items';

  constructor(private http: HttpClient) {}

  uploadExcel(file: File): Observable<MessageResponse<ItemResponseDto[]>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MessageResponse<ItemResponseDto[]>>(`${this.apiUrl}/upload`, formData);
  }

  addFullCostume(item: ItemRequestDto): Observable<ItemResponseDto> {
    return this.http.post<ItemResponseDto>(`${this.apiUrl}/add-full`, item);
  }

  updateFullCostume(costumeId: number, item: ItemRequestDto): Observable<ItemResponseDto> {
    return this.http.put<ItemResponseDto>(`${this.apiUrl}/update/${costumeId}`, item);
  }

  deleteCostume(costumeId: number): Observable<MessageResponse<string>> {
    return this.http.delete<MessageResponse<string>>(`${this.apiUrl}/delete/${costumeId}`);
  }

  getAllItems(): Observable<ItemResponseDto[]> {
    return this.http.get<ItemResponseDto[]>(`${this.apiUrl}/getAll`);
  }

  getNextSerialNumber(params: {
    categoryName: string;
    primaryColor: string;
    secondaryColor?: string;
    tertiaryColor?: string;
    size: string;
  }): Observable<number> {
    const { categoryName, primaryColor, secondaryColor = '', tertiaryColor = '', size } = params;
    const url = `${this.apiUrl}/next-serial?categoryName=${encodeURIComponent(categoryName)}&primaryColor=${encodeURIComponent(primaryColor)}&secondaryColor=${encodeURIComponent(secondaryColor)}&tertiaryColor=${encodeURIComponent(tertiaryColor)}&size=${encodeURIComponent(size)}`;
    return this.http.get<number>(url);
  }
}
