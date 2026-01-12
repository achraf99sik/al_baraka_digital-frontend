import { Routes } from '@angular/router';
import { Home } from './module/home/home';
import { Register } from './module/register/register';
import { Login } from './module/login/login';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: Home
  },
  {
    path: 'register',
    title: 'Register',
    component: Register
  },
  {
    path: 'login',
    title: 'Login',
    component: Login
  }
];
