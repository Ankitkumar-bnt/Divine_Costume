import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'error';
    actionLabel?: string;
    onAction?: () => void;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    public toasts$ = this.toastsSubject.asObservable();

    show(toast: Omit<Toast, 'id'>): string {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast: Toast = { ...toast, id };

        const currentToasts = this.toastsSubject.value;
        this.toastsSubject.next([...currentToasts, newToast]);

        // Auto-dismiss after duration (default 5 seconds)
        const duration = toast.duration ?? 5000;
        setTimeout(() => {
            this.dismiss(id);
        }, duration);

        return id;
    }

    dismiss(id: string): void {
        const currentToasts = this.toastsSubject.value;
        this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
    }

    success(message: string, actionLabel?: string, onAction?: () => void): string {
        return this.show({
            message,
            type: 'success',
            actionLabel,
            onAction
        });
    }

    info(message: string, actionLabel?: string, onAction?: () => void): string {
        return this.show({
            message,
            type: 'info',
            actionLabel,
            onAction
        });
    }

    error(message: string): string {
        return this.show({
            message,
            type: 'error'
        });
    }
}
