import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },

  // Public routes
  { path: 'login',    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'about',    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'trainers', loadComponent: () => import('./pages/trainers/trainers.component').then(m => m.TrainersComponent) },

//   // User routes (protected)
//   { path: 'schedule',    canActivate: [authGuard], loadComponent: () => import('./pages/schedule/schedule.component').then(m => m.ScheduleComponent) },
//   { path: 'my-bookings', canActivate: [authGuard], loadComponent: () => import('./pages/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent) },
//   { path: 'profile',     canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },

//   // Admin routes (protected)
//   { path: 'admin/dashboard', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
//   { path: 'admin/classes',   canActivate: [adminGuard], loadComponent: () => import('./pages/admin/classes/classes.component').then(m => m.ClassesComponent) },
//   { path: 'admin/bookings',  canActivate: [adminGuard], loadComponent: () => import('./pages/admin/bookings/bookings.component').then(m => m.BookingsComponent) },

  { path: '**', redirectTo: '/about' }
];