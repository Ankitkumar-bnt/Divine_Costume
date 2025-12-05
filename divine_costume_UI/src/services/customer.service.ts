import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerCreateDTO {
    name: string;
    email: string;
    password: string;
    contact: string;
    alternateContact?: string;
    address: string;
}

export interface CustomerDTO {
    id: number;
    name: string;
    email: string;
    contact: string;
    alternateContact?: string;
    address: string;
    signinDate?: string;
    loginStatus?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private apiUrl = 'http://localhost:8080/api/customers';

    constructor(private http: HttpClient) { }

    /**
     * Create new customer (Registration)
     */
    createCustomer(customerData: CustomerCreateDTO): Observable<CustomerDTO> {
        return this.http.post<CustomerDTO>(this.apiUrl, customerData);
    }

    /**
     * Get customer by email
     */
    getCustomerByEmail(email: string): Observable<CustomerDTO> {
        return this.http.get<CustomerDTO>(`${this.apiUrl}/email/${email}`);
    }

    /**
     * Get all customers
     */
    getAllCustomers(): Observable<CustomerDTO[]> {
        return this.http.get<CustomerDTO[]>(this.apiUrl);
    }

    /**
     * Get customer by ID
     */
    getCustomerById(id: number): Observable<CustomerDTO> {
        return this.http.get<CustomerDTO>(`${this.apiUrl}/${id}`);
    }

    /**
     * Update customer
     */
    updateCustomer(id: number, customerData: CustomerCreateDTO): Observable<CustomerDTO> {
        return this.http.put<CustomerDTO>(`${this.apiUrl}/${id}`, customerData);
    }

    /**
     * Delete customer
     */
    deleteCustomer(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    /**
     * Login customer
     */
    login(email: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, { email, password });
    }

    /**
     * Logout customer
     */
    logout(customerId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${customerId}/logout`, {});
    }

    /**
     * Update login status
     */
    updateLoginStatus(customerId: number, loginStatus: boolean): Observable<any> {
        return this.http.put(`${this.apiUrl}/${customerId}/login-status`, { loginStatus });
    }

    /**
     * Check if customer is already logged in (by email)
     */
    checkLoginStatus(email: string): Observable<CustomerDTO> {
        return this.http.get<CustomerDTO>(`${this.apiUrl}/email/${email}`);
    }
}
