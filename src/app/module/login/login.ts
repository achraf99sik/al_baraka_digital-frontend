import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginRequest } from '../../dto/request/login-request';
import { AuthService } from '../../service/auth-service';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, AsyncPipe],
  template: `
  <body class="text-white min-h-screen flex items-center justify-center p-4 relative">
    <div class="mesh-bg"></div>
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
      <div
        class="absolute top-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
      ></div>
      <div
        class="absolute top-0 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute -bottom-8 left-1/3 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
      ></div>
    </div>

    <main
      class="glass-card w-full max-w-225 rounded-3xl overflow-hidden grid md:grid-cols-5 animate-fade-in-up"
    >
      <div
        class="hidden md:flex md:col-span-2 bg-linear-to-br from-blue-900 to-slate-900 p-10 flex-col justify-between relative overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
        ></div>

        <div class="z-10">
          <div
            routerLink="/"
            class="cursor-pointer w-12 h-12 rounded-xl bg-linear-to-tr from-cyan-400 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30"
          >
            <i class="fa-solid fa-bank text-white text-xl"></i>
          </div>
          <h1 class="text-3xl font-bold leading-tight">
            Future of <br /><span
              class="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500"
              >Banking</span
            >
          </h1>
          <p class="text-slate-400 mt-4 text-sm font-light">
            Secure. Robust. Digital. Experience the new era of Al Baraka.
          </p>
        </div>

        <div class="z-10">
          <div class="flex items-center gap-3 text-xs text-slate-400">
            <div class="flex -space-x-2">
              <div class="w-8 h-8 rounded-full bg-slate-700 border border-slate-800"></div>
              <div class="w-8 h-8 rounded-full bg-slate-600 border border-slate-800"></div>
              <div class="w-8 h-8 rounded-full bg-slate-500 border border-slate-800"></div>
            </div>
            <span>Trusted by 10k+ users</span>
          </div>
        </div>

        <div
          class="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-500 rounded-full filter blur-3xl opacity-30"
        ></div>
      </div>

      <div class="md:col-span-3 p-8 md:p-12 relative">
        <h2 class="text-2xl font-bold mb-1">Welcome Back</h2>
        <p class="text-slate-400 text-sm mb-8">Enter your details to access the dashboard.</p>

        <div id="loginForm" class="space-y-5">
          <div class="space-y-2">
            <label class="text-xs font-semibold text-cyan-400 uppercase tracking-wider ml-1"
              >Email</label
            >
            <div class="relative">
              <input
                [(ngModel)]="payload.email"
                type="email"
                name="email"
                value="admin@baraka.com"
                class="input-field w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-0 placeholder-slate-600 text-sm pl-11"
                placeholder="name@company.com"
              />
              <i class="fa-regular fa-envelope absolute left-4 top-3.5 text-slate-500"></i>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold text-cyan-400 uppercase tracking-wider ml-1"
              >Password</label
            >
            <div class="relative">
              <input
                [(ngModel)]="payload.password"
                [type]="showPassword ? 'text' : 'password'"
                name="password"
                value="password123"
                class="input-field w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-0 placeholder-slate-600 text-sm pl-11"
                placeholder="••••••••"
              />
              <i class="fa-solid fa-lock absolute left-4 top-3.5 text-slate-500"></i>
              <button
                (click)="showPassword = !showPassword"
                class="absolute h-full right-4 text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <div class="pt-4">
            <button
              (click)="submit()"
              [disabled]="isLoading | async"
              class="group cursor-pointer relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i
                  class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"
                ></i>
              </span>
              Authenticate
            </button>
          </div>

          <p class="text-center text-xs text-slate-500 mt-4">
            Join us
            <a routerLink="/register" class="text-cyan-400 hover:text-cyan-300 underline"
              >Register</a
            >
          </p>
        </div>
      </div>
    </main>
  </body>
  `,
  styleUrl: './login.css',
})
export class Login {
  showPassword: boolean = false;
  isLoading: Observable<boolean> = of(false);
  payload: LoginRequest = {
    email: '',
    password: '',
  };
  constructor(private authService: AuthService) {
    this.isLoading = this.authService.isLoading$;
  }
  submit() {
    this.authService.login(this.payload);
  }
}
