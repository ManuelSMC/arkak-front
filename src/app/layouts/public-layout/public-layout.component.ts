import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- NAVBAR -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-earth-200 shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 text-primary-600 font-extrabold text-2xl tracking-tight">
            <span class="material-icons text-3xl">apartment</span>
            ArkaK
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-8">
            <a routerLink="/" routerLinkActive="text-primary-600 font-semibold" [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-700 hover:text-primary-600 transition-colors text-sm">Inicio</a>
            <a routerLink="/propiedades" routerLinkActive="text-primary-600 font-semibold"
               class="text-gray-700 hover:text-primary-600 transition-colors text-sm">Propiedades</a>
          </div>

          <!-- Auth Buttons -->
          <div class="hidden md:flex items-center gap-3">
            @if (authService.isAuthenticated) {
              <a [routerLink]="authService.getRedirectUrl()"
                 class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Mi Panel
              </a>
            } @else {
              <a routerLink="/login"
                 class="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors">
                Iniciar sesión
              </a>
              <a routerLink="/registro"
                 class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Registrarse
              </a>
            }
          </div>

          <!-- Mobile Menu Toggle -->
          <button (click)="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-gray-600">
            <span class="material-icons">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>

        <!-- Mobile Menu -->
        @if (mobileMenuOpen) {
          <div class="md:hidden border-t border-earth-200 py-4 space-y-3 animate-fade-in-up">
            <a routerLink="/" (click)="mobileMenuOpen = false"
               class="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg">Inicio</a>
            <a routerLink="/propiedades" (click)="mobileMenuOpen = false"
               class="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg">Propiedades</a>
            <hr class="border-earth-200">
            @if (authService.isAuthenticated) {
              <a [routerLink]="authService.getRedirectUrl()" (click)="mobileMenuOpen = false"
                 class="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center font-medium">Mi Panel</a>
            } @else {
              <a routerLink="/login" (click)="mobileMenuOpen = false"
                 class="block px-4 py-2 text-primary-600 border border-primary-600 rounded-lg text-center">Iniciar sesión</a>
              <a routerLink="/registro" (click)="mobileMenuOpen = false"
                 class="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center">Registrarse</a>
            }
          </div>
        }
      </nav>
    </header>

    <!-- MAIN CONTENT -->
    <main class="pt-16 min-h-screen">
      <router-outlet />
    </main>

    <!-- FOOTER -->
    <footer class="bg-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          <!-- Brand -->
          <div class="md:col-span-1">
            <div class="flex items-center gap-2 text-2xl font-extrabold mb-4">
              <span class="material-icons text-primary-400">apartment</span>
              ArkaK
            </div>
            <p class="text-primary-200 text-sm leading-relaxed">
              Tu hogar ideal te espera. Encuentra las mejores propiedades con la ayuda de agentes certificados.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold text-lg mb-4">Explorar</h4>
            <ul class="space-y-2 text-sm text-primary-200">
              <li><a routerLink="/propiedades" class="hover:text-white transition-colors">Todas las propiedades</a></li>
              <li><a routerLink="/propiedades" [queryParams]="{operation_type: 'venta'}" class="hover:text-white transition-colors">En venta</a></li>
              <li><a routerLink="/propiedades" [queryParams]="{operation_type: 'renta'}" class="hover:text-white transition-colors">En renta</a></li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="font-semibold text-lg mb-4">Empresa</h4>
            <ul class="space-y-2 text-sm text-primary-200">
              <li><a href="#" class="hover:text-white transition-colors">Sobre nosotros</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Términos y condiciones</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Política de privacidad</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold text-lg mb-4">Contacto</h4>
            <ul class="space-y-3 text-sm text-primary-200">
              <li class="flex items-center gap-2">
                <span class="material-icons-outlined text-base">email</span>
                contacto&#64;arkak.com
              </li>
              <li class="flex items-center gap-2">
                <span class="material-icons-outlined text-base">phone</span>
                +52 (33) 1234-5678
              </li>
              <li class="flex items-center gap-2">
                <span class="material-icons-outlined text-base">location_on</span>
                Guadalajara, Jalisco, México
              </li>
            </ul>
            <!-- Social -->
            <div class="flex gap-4 mt-4">
              <a href="#" class="w-9 h-9 bg-primary-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <span class="text-xs font-bold">FB</span>
              </a>
              <a href="#" class="w-9 h-9 bg-primary-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <span class="text-xs font-bold">IG</span>
              </a>
              <a href="#" class="w-9 h-9 bg-primary-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <span class="text-xs font-bold">TW</span>
              </a>
            </div>
          </div>
        </div>

        <div class="border-t border-primary-700 mt-12 pt-8 text-center text-sm text-primary-300">
          © 2026 ArkaK. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  `,
})
export class PublicLayoutComponent {
  authService = inject(AuthService);
  mobileMenuOpen = false;
}
