import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toast$ | async; as toast) {
      <div class="fixed top-4 right-4 z-[9999] max-w-sm animate-fade-in-up" role="alert">
        <div class="flex items-center gap-3 px-5 py-4 rounded-xl shadow-elevated text-white text-sm font-medium"
             [class]="getClass(toast.type)">
          <span class="material-icons-outlined text-xl">{{ getIcon(toast.type) }}</span>
          <span class="flex-1">{{ toast.message }}</span>
          <button (click)="dismiss()" class="opacity-70 hover:opacity-100 transition-opacity">
            <span class="material-icons text-lg">close</span>
          </button>
        </div>
      </div>
    }
  `,
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toast$ = this.toastService.toast;

  getClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'bg-emerald-600',
      error: 'bg-red-600',
      warning: 'bg-amber-600',
      info: 'bg-primary-600',
    };
    return classes[type] || classes['info'];
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
    };
    return icons[type] || 'info';
  }

  dismiss(): void {
    (this.toastService as any)['toast$'].next(null);
  }
}
