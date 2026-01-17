import { Routes } from '@angular/router';
import { Home } from './module/home/home';
import { Register } from './module/register/register';
import { Login } from './module/login/login';
import { authGuard } from './guard/auth.guard';
import { roleGuard } from './guard/role.guard';
import { noAuthGuard } from './guard/no-auth.guard';

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
    canActivate: [noAuthGuard]
  },
  {
    path: 'login',
    title: 'Login | Al Baraka Digital',
    component: Login,
    canActivate: [noAuthGuard]
  },
  {
    path: 'client/dashboard',
    title: 'Client Dashboard | Al Baraka Digital',
    loadComponent: () => import('./module/client/client-dashboard.component').then(m => m.ClientDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'CLIENT' }
  },
  {
    path: 'agent/dashboard',
    title: 'Agent Dashboard | Al Baraka Digital',
    loadComponent: () => import('./module/agent/agent-dashboard.component').then(m => m.AgentDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'AGENT_BANCAIRE' } // Matching the Postman collection role
  },
  {
    path: 'admin/dashboard',
    title: 'Admin Dashboard | Al Baraka Digital',
    loadComponent: () => import('./module/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  }
];
