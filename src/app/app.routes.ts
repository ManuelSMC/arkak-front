import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ============ PUBLIC ============
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent) },
      { path: 'propiedades', loadComponent: () => import('./features/public/property-list/property-list.component').then(m => m.PropertyListComponent) },
      { path: 'propiedades/:id', loadComponent: () => import('./features/public/property-detail/property-detail.component').then(m => m.PropertyDetailComponent) },
      { path: 'vendedor/:id', loadComponent: () => import('./features/public/seller-profile/seller-profile.component').then(m => m.SellerProfileComponent) },
      { path: 'comparar', loadComponent: () => import('./features/public/property-compare/property-compare.component').then(m => m.PropertyCompareComponent) },
    ],
  },

  // ============ AUTH ============
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'solicitud-vendedor', loadComponent: () => import('./features/auth/seller-request/seller-request.component').then(m => m.SellerRequestComponent) },
  { path: 'cambiar-password', loadComponent: () => import('./features/auth/force-change-password/force-change-password.component').then(m => m.ForceChangePasswordComponent) },
  { path: 'recuperar-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password/:token', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'verificar/:token', loadComponent: () => import('./features/auth/verify-account/verify-account.component').then(m => m.VerifyAccountComponent) },

  // ============ ADMIN ============
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'usuarios', loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'propiedades', loadComponent: () => import('./features/admin/properties/admin-properties.component').then(m => m.AdminPropertiesComponent) },
      { path: 'solicitudes', loadComponent: () => import('./features/admin/seller-requests/admin-seller-requests.component').then(m => m.AdminSellerRequestsComponent) },
    ],
  },

  // ============ VENDEDOR ============
  {
    path: 'vendedor',
    loadComponent: () => import('./layouts/seller-layout/seller-layout.component').then(m => m.SellerLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['vendedor'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/seller/dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent) },
      { path: 'propiedades', loadComponent: () => import('./features/seller/properties/seller-properties.component').then(m => m.SellerPropertiesComponent) },
      { path: 'propiedades/nueva', loadComponent: () => import('./features/seller/property-form/property-form.component').then(m => m.PropertyFormComponent) },
      { path: 'propiedades/editar/:id', loadComponent: () => import('./features/seller/property-form/property-form.component').then(m => m.PropertyFormComponent) },
      { path: 'agenda', loadComponent: () => import('./features/seller/schedule/seller-schedule.component').then(m => m.SellerScheduleComponent) },
      { path: 'citas', loadComponent: () => import('./features/seller/appointments/seller-appointments.component').then(m => m.SellerAppointmentsComponent) },
      { path: 'perfil', loadComponent: () => import('./features/seller/profile/seller-profile-edit.component').then(m => m.SellerProfileEditComponent) },
    ],
  },

  // ============ CLIENTE ============
  {
    path: 'cliente',
    loadComponent: () => import('./layouts/client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['cliente'] },
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent) },
      { path: 'propiedades', loadComponent: () => import('./features/public/property-list/property-list.component').then(m => m.PropertyListComponent) },
      { path: 'propiedades/:id', loadComponent: () => import('./features/public/property-detail/property-detail.component').then(m => m.PropertyDetailComponent) },
      { path: 'vendedor/:id', loadComponent: () => import('./features/public/seller-profile/seller-profile.component').then(m => m.SellerProfileComponent) },
      { path: 'comparar', loadComponent: () => import('./features/public/property-compare/property-compare.component').then(m => m.PropertyCompareComponent) },
      { path: 'buscar', loadComponent: () => import('./features/client/search/client-search.component').then(m => m.ClientSearchComponent) },
      { path: 'favoritos', loadComponent: () => import('./features/client/favorites/client-favorites.component').then(m => m.ClientFavoritesComponent) },
      { path: 'citas', loadComponent: () => import('./features/client/appointments/client-appointments.component').then(m => m.ClientAppointmentsComponent) },
      { path: 'agendar/:propertyId', loadComponent: () => import('./features/client/book-appointment/book-appointment.component').then(m => m.BookAppointmentComponent) },
      { path: 'perfil', loadComponent: () => import('./features/client/profile/client-profile.component').then(m => m.ClientProfileComponent) },
    ],
  },

  // Wildcard
  { path: '**', redirectTo: '' },
];
