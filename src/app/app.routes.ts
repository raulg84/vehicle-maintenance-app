import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/pages/login/login').then((m) => m.Login),
    },
    {
        path: 'vehicles',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/vehicles/pages/vehicle-list/vehicle-list').then(
                (m) => m.VehicleList
            ),
    },
    {
        path: 'vehicles/new',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/vehicles/pages/vehicle-form/vehicle-form').then(
                (m) => m.VehicleForm
            ),
    },
    {
        path: 'vehicles/:id/edit',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/vehicles/pages/vehicle-form/vehicle-form').then(
                (m) => m.VehicleForm
            ),
    },
    {
        path: 'maintenances/new',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/maintenances/pages/maintenance-form/maintenance-form').then(
                (m) => m.MaintenanceForm
            ),
    },
    {
        path: 'vehicles/:id/maintenances',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/maintenances/pages/maintenance-list/maintenance-list').then(
                (m) => m.MaintenanceList
            ),
    },
    {
        path: 'maintenances/:id/edit',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/maintenances/pages/maintenance-form/maintenance-form').then(
                (m) => m.MaintenanceForm
            ),
    },
    {
        path: 'vehicles/:id/dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/dashboard/pages/vehicle-dashboard/vehicle-dashboard').then(
                (m) => m.VehicleDashboard
            ),
    }
];