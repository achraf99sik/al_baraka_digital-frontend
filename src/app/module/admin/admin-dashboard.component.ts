import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../service/admin-service';
import { AuthService } from '../../service/auth-service';
import { CreateUserRequest, UserResponse } from '../../dto/request/admin.interface';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <body class="text-slate-300 relative font-sans min-h-screen bg-slate-900">
       <!-- Background -->
      <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
         <div class="absolute top-[-10%] left-[-10%] w-150 h-150 bg-rose-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
         <div class="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-orange-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>
      </div>

      <!-- Navigation -->
      <nav class="fixed w-full z-50 glass-nav border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div [routerLink]="'/'" class="flex cursor-pointer items-center gap-3">
                 <div class="w-10 h-10 rounded-xl bg-linear-to-tr from-rose-500 to-orange-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <i class="fa-solid fa-shield-halved text-white text-lg"></i>
                  </div>
                  <span class="text-white font-bold text-xl tracking-tight">Al Baraka<span class="text-rose-400">.</span> Admin</span>
            </div>
            <button (click)="logout()" class="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
        </div>
      </nav>

       <main class="pt-24 pb-12 px-6">
        <div class="max-w-7xl mx-auto space-y-8">
            
             <header class="flex justify-between items-end">
                <div>
                    <h1 class="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p class="text-slate-400">Oversee system access and manage staff accounts.</p>
                </div>
                <button (click)="openCreateModal()" class="bg-white text-slate-900 font-bold px-6 py-2.5 rounded-lg hover:bg-rose-50 transition-all hover:scale-105 shadow-lg shadow-white/10 flex items-center gap-2">
                    <i class="fa-solid fa-user-plus"></i> Create User
                </button>
            </header>

            <!-- Users List -->
            <div class="glass rounded-2xl border border-white/5 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-slate-400">
                        <thead class="text-xs uppercase bg-slate-900/50 text-slate-300">
                            <tr>
                                <th class="px-6 py-4 font-medium">User</th>
                                <th class="px-6 py-4 font-medium">Role</th>
                                <th class="px-6 py-4 font-medium">Email</th>
                                <th class="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                         <tbody class="divide-y divide-white/5">
                             <tr *ngFor="let user of users" class="hover:bg-white/5 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                            {{ user.fullName.charAt(0) }}
                                        </div>
                                        <div class="font-medium text-white">{{ user.fullName }}</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                     <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                                        [ngClass]="{
                                            'bg-rose-500/10 text-rose-400 border-rose-500/20': user.role === 'ADMIN',
                                            'bg-purple-500/10 text-purple-400 border-purple-500/20': user.role === 'AGENT_BANCAIRE',
                                            'bg-cyan-500/10 text-cyan-400 border-cyan-500/20': user.role === 'CLIENT'
                                        }">
                                        {{ user.role }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm">{{ user.email }}</td>
                                <td class="px-6 py-4 text-right">
                                    <button *ngIf="user.role !== 'ADMIN'" (click)="deleteUser(user.id)" class="text-slate-500 hover:text-red-400 transition-colors" title="Delete User">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
       </main>

       <!-- Create Modal -->
       <div *ngIf="showModal" class="fixed inset-0 z-100 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="closeModal()"></div>
          <div class="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
               <h3 class="text-xl font-bold text-white mb-6">Create New Staff</h3>
               
               <div class="space-y-4">
                   <div class="grid grid-cols-2 gap-4">
                       <div>
                           <label class="block text-xs font-bold text-slate-400 uppercase mb-2">First Name</label>
                           <input [(ngModel)]="newUser.firstname" type="text" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-slate-600">
                       </div>
                       <div>
                           <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Last Name</label>
                           <input [(ngModel)]="newUser.lastname" type="text" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-slate-600">
                       </div>
                   </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                        <input [(ngModel)]="newUser.email" type="email" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-slate-600">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
                        <input [(ngModel)]="newUser.password" type="password" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-slate-600">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Role</label>
                        <select [(ngModel)]="newUser.role" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all">
                            <option value="AGENT_BANCAIRE">Agent Bancaire</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>

                   <button (click)="submitCreate()" class="w-full bg-linear-to-tr from-rose-500 to-orange-600 hover:from-rose-400 hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-500/20 transition-all transform active:scale-95 mt-2">
                       Create Account
                   </button>
                   <button (click)="closeModal()" class="w-full text-slate-400 hover:text-white font-medium py-2 transition-colors">Cancel</button>
               </div>
          </div>
      </div>

    </body>
  `
})
export class AdminDashboardComponent implements OnInit {
  users: UserResponse[] = [];
  
  showModal = false;
  newUser: CreateUserRequest = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'AGENT_BANCAIRE'
  };

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.findAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  deleteUser(id: string) {
    if(confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        this.adminService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

  openCreateModal() {
    this.newUser = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'AGENT_BANCAIRE'
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitCreate() {
    this.adminService.createUser(this.newUser).subscribe(() => {
        this.closeModal();
        this.loadUsers();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
