import { Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { UserComponent }   from './user/user.component';
import { UpgradeComponent }   from './upgrade/upgrade.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'user',
        component: UserComponent
    },
   
   
    {
        path: 'upgrade',
        component: UpgradeComponent
    }
]
