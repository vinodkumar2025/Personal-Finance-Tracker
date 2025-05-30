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
        ]
    }
];
