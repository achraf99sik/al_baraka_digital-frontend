import { Routes } from '@angular/router';
import { Home } from './module/home/home';
import { Register } from './module/register/register';
import { Login } from './module/login/login';

export const routes: Routes = [
  {
    path: '',
    title: 'Al Baraka Digital | The Future of Banking',
    component: Home,
  },
  {
    path: 'register',
    title: 'Join Al Baraka Digital',
    component: Register,
  },
  {
    path: 'login',
    title: 'Login | Al Baraka Digital',
    component: Login,
  },
];
