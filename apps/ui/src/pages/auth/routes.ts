import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth-layout/auth-layout'),
    children: [
      {
        path: 'register',
        loadComponent: () => import('./register/register'),
        title: 'e-Ticaret | Kayıt Ol',
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login'),
        title: 'e-Ticaret | Giriş Yap',
      },
    ],
  },
];

export default routes;
