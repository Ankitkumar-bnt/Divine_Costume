import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuthState {
    isAuthenticated: boolean;
    userRole: 'admin' | 'customer' | null;
    userEmail: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authStateSubject = new BehaviorSubject<AuthState>({
        isAuthenticated: false,
        userRole: null,
        userEmail: null
    });

    public authState$: Observable<AuthState> = this.authStateSubject.asObservable();

    constructor() {
        // Load auth state from localStorage on service initialization
        this.loadAuthState();
    }

    private loadAuthState(): void {
        const savedAuth = localStorage.getItem('authState');
        if (savedAuth) {
            try {
                const authState = JSON.parse(savedAuth);
                this.authStateSubject.next(authState);
            } catch (e) {
                console.error('Failed to parse auth state from localStorage', e);
                this.clearAuthState();
            }
        }
    }

    private saveAuthState(state: AuthState): void {
        localStorage.setItem('authState', JSON.stringify(state));
        this.authStateSubject.next(state);
    }

    private clearAuthState(): void {
        localStorage.removeItem('authState');
        this.authStateSubject.next({
            isAuthenticated: false,
            userRole: null,
            userEmail: null
        });
    }

    login(email: string, role: 'admin' | 'customer'): void {
        const authState: AuthState = {
            isAuthenticated: true,
            userRole: role,
            userEmail: email
        };
        this.saveAuthState(authState);
    }

    logout(): void {
        this.clearAuthState();
    }

    getCurrentAuthState(): AuthState {
        return this.authStateSubject.value;
    }

    isAuthenticated(): boolean {
        return this.authStateSubject.value.isAuthenticated;
    }

    isAdmin(): boolean {
        return this.authStateSubject.value.userRole === 'admin';
    }

    isCustomer(): boolean {
        return this.authStateSubject.value.userRole === 'customer';
    }

    getUserEmail(): string | null {
        return this.authStateSubject.value.userEmail;
    }
}
