import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toast$ = new BehaviorSubject<Toast | null>(null);
  toast = this.toast$.asObservable();

  show(message: string, type: Toast['type'] = 'info', duration = 4000): void {
    this.toast$.next({ message, type, duration });
    if (duration > 0) {
      setTimeout(() => this.toast$.next(null), duration);
    }
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error', 6000); }
  info(message: string): void { this.show(message, 'info'); }
  warning(message: string): void { this.show(message, 'warning', 5000); }
}
