import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemRequestDto {
  categoryName: string;
  categoryDescription: string;
  variantDescription: string;
  style: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  numberOfItemsAvailable: number;
  size: string;
  serialNumber: string;
  purchasePrice: number;
  rentalPricePerDay: number;
  depositAmount: number;
  isRentable: boolean;
  imageUrls?: string[];
}

export interface ItemResponseDto {
  costumeId: number;
  categoryName: string;
  categoryDescription: string;
  variantDescription: string;
  style: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  numberOfItemsAvailable: number;
  size: string;
  serialNumber: string;
  purchasePrice: number;
  rentalPricePerDay: number;
  depositAmount: number;
  isRentable: boolean;
  imageUrls?: string[];
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
}
