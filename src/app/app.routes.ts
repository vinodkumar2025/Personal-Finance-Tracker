import { Routes } from '@angular/router';
import { MainIndexComponent } from './layout/main-index/main-index.component';

export const routes: Routes = [
    {
        path: '',
        component: MainIndexComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./feature/dashboard/dashboard.routes').then(
                        (m) => m.DASHBOARD_ROUTES
                    ),
            },
            {
                path: 'transactions',
                loadChildren: () =>
                    import('./feature/transactions/transactions.routes').then(
                        (m) => m.TRANSACTIONS_ROUTES
                    ),
            },
            {
                path: 'reports',
                loadChildren: () =>
                    import('./feature/reports/reports.routes').then(
                        (m) => m.REPORTS_ROUTES
                    ),
            },
            {
                path: 'categories',
                loadChildren: () =>
                    import('./feature/categories/categories.routes').then(
                        (m) => m.CATEGORIES_ROUTES
                    ),
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('./feature/settings/settings.routes').then(
                        (m) => m.SETTINGS_ROUTES
                    ),
            },
        ]
    }
];
