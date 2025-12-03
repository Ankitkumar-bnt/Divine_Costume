import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

export interface WishlistItem {
    id: string;
    productId: number;
    name: string;
    description: string;
    image: string;
    color: string;
    size: string;
    rentPerDay: number;
    deposit: number;
}

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private readonly STORAGE_KEY = 'divine_costume_wishlist';
    private wishlistSubject = new BehaviorSubject<WishlistItem[]>(this.loadFromStorage());
    public wishlistItems$: Observable<WishlistItem[]> = this.wishlistSubject.asObservable();

    constructor(
        private router: Router,
        private toastService: ToastService
    ) { }

    private loadFromStorage(): WishlistItem[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    private saveToStorage(items: WishlistItem[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Failed to save wishlist to localStorage:', error);
        }
    }

    getWishlistItems(): WishlistItem[] {
        return this.wishlistSubject.value;
    }

    isInWishlist(productId: number): boolean {
        return this.wishlistSubject.value.some(item => item.productId === productId);
    }

    addToWishlist(item: WishlistItem): void {
        const currentItems = this.wishlistSubject.value;

        // Check if item already exists
        if (currentItems.some(i => i.id === item.id)) {
            return;
        }

        const updatedItems = [...currentItems, item];
        this.wishlistSubject.next(updatedItems);
        this.saveToStorage(updatedItems);

        // Show success toast
        this.toastService.success(
            'Added to wishlist',
            'View wishlist',
            () => {
                this.router.navigate(['/wishlist']);
            }
        );
    }

    removeFromWishlist(id: string): void {
        const currentItems = this.wishlistSubject.value;
        const itemToRemove = currentItems.find(i => i.id === id);

        if (!itemToRemove) {
            return;
        }

        const updatedItems = currentItems.filter(i => i.id !== id);
        this.wishlistSubject.next(updatedItems);
        this.saveToStorage(updatedItems);

        // Show removal toast with undo option
        this.toastService.info(
            'Removed from wishlist',
            'Undo',
            () => {
                // Undo - add the item back
                this.addToWishlistSilent(itemToRemove);
                this.toastService.success('Item restored');
            }
        );
    }

    // Silent add (no toast) - used for undo functionality
    private addToWishlistSilent(item: WishlistItem): void {
        const currentItems = this.wishlistSubject.value;
        const updatedItems = [...currentItems, item];
        this.wishlistSubject.next(updatedItems);
        this.saveToStorage(updatedItems);
    }

    clearWishlist(): void {
        this.wishlistSubject.next([]);
        this.saveToStorage([]);
    }
}
