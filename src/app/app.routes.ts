import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'vehicles',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/pages/login/login').then((m) => m.Login),
    },
    {
        path: 'vehicles',
        loadComponent: () =>
            import('./features/vehicles/pages/vehicle-list/vehicle-list').then(
                (m) => m.VehicleList
            ),
    },
    {
        path: 'vehicles/new',
        loadComponent: () =>
            import('./features/vehicles/pages/vehicle-form/vehicle-form').then(
                (m) => m.VehicleForm
            ),
    },
    {
        path: 'maintenances/new',
        loadComponent: () =>
            import('./features/maintenances/pages/maintenance-form/maintenance-form').then(
                (m) => m.MaintenanceForm
            ),
    },
    {
        path: 'vehicles/:id/maintenances',
        loadComponent: () =>
            import('./features/maintenances/pages/maintenance-list/maintenance-list').then(
                (m) => m.MaintenanceList
            ),
    },
    {
        path: 'vehicles/:id/dashboard',
        loadComponent: () =>
            import('./features/dashboard/pages/vehicle-dashboard/vehicle-dashboard').then(
                (m) => m.VehicleDashboard
            ),
    },
];