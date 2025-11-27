import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
    id: number;
    productId: number;
    name: string;
    description: string;
    color: string;
    size: string;
    image: string;
    rentPerDay: number;
    deposit: number;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = new BehaviorSubject<CartItem[]>([]);
    cartItems$ = this.cartItems.asObservable();

    constructor() {
        // Load cart from localStorage if available
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cartItems.next(JSON.parse(savedCart));
        }
    }

    addToCart(item: Omit<CartItem, 'id' | 'quantity'>) {
        const currentItems = this.cartItems.value;
        const existingItemIndex = currentItems.findIndex(
            i => i.productId === item.productId && i.color === item.color && i.size === item.size
        );

        if (existingItemIndex > -1) {
            // Item already exists, increment quantity
            currentItems[existingItemIndex].quantity += 1;
            this.cartItems.next([...currentItems]);
        } else {
            // Add new item with quantity 1
            const newItem: CartItem = { ...item, id: Date.now(), quantity: 1 };
            this.cartItems.next([...currentItems, newItem]);
        }

        this.saveCart();
    }

    updateQuantity(itemId: number, quantity: number) {
        const currentItems = this.cartItems.value;
        const itemIndex = currentItems.findIndex(i => i.id === itemId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                currentItems[itemIndex].quantity = quantity;
                this.cartItems.next([...currentItems]);
                this.saveCart();
            }
        }
    }

    removeItem(itemId: number) {
        const currentItems = this.cartItems.value.filter(i => i.id !== itemId);
        this.cartItems.next(currentItems);
        this.saveCart();
    }

    clearCart() {
        this.cartItems.next([]);
        this.saveCart();
    }

    getCartCount(): number {
        return this.cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotalRent(): number {
        return this.cartItems.value.reduce((sum, item) => sum + (item.rentPerDay * item.quantity), 0);
    }

    getTotalDeposit(): number {
        return this.cartItems.value.reduce((sum, item) => sum + (item.deposit * item.quantity), 0);
    }

    getGrandTotal(): number {
        return this.getTotalRent() + this.getTotalDeposit();
    }

    private saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
    }
}
