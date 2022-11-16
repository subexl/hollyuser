import { Routes } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('../../dash/dash.module').then((m) => m.DashModule),
    },
    {
        path: 'account',
        loadChildren: () =>
            import('../../account/account.module').then((m) => m.AccountModule),
    },
];
