import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../service/agent-service';
import { AuthService } from '../../service/auth-service';
import { OperationResponse } from '../../dto/request/client.interface';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <body class="text-slate-300 relative font-sans min-h-screen bg-slate-900">
      <!-- Background -->
      <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
         <div class="absolute top-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/20 to-transparent"></div>
         <div class="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>
      </div>

      <!-- Navigation -->
      <nav class="fixed w-full z-50 glass-nav border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div [routerLink]="'/'" class="flex cursor-pointer items-center gap-3">
                 <div class="w-10 h-10 rounded-xl bg-linear-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <i class="fa-solid fa-user-shield text-white text-lg"></i>
                  </div>
                  <span class="text-white font-bold text-xl tracking-tight">Al Baraka<span class="text-purple-400">.</span> Agent</span>
            </div>
            <button (click)="logout()" class="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-6">
        <div class="max-w-7xl mx-auto space-y-8">
            
            <header class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-white mb-2">Pending Operations</h1>
                    <p class="text-slate-400">Review and validate client transaction requests.</p>
                </div>
                <button (click)="loadPendingOperations()" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors flex items-center gap-2">
                    <i class="fa-solid fa-rotate"></i> Refresh List
                </button>
            </header>

            <div class="glass rounded-2xl border border-white/5 overflow-hidden min-h-[400px]">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-slate-400">
                        <thead class="text-xs uppercase bg-slate-900/50 text-slate-300">
                            <tr>
                                <th class="px-6 py-4 font-medium">Request Date</th>
                                <th class="px-6 py-4 font-medium">Operation</th>
                                <th class="px-6 py-4 font-medium">Source Account</th>
                                <th class="px-6 py-4 font-medium text-right">Amount</th>
                                <th class="px-6 py-4 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                         <tbody class="divide-y divide-white/5">
                             <tr *ngFor="let op of pendingOperations" class="hover:bg-white/5 transition-colors group">
                                <td class="px-6 py-4 whitespace-nowrap">{{ op.createdAt | date:'medium' }}</td>
                                <td class="px-6 py-4">
                                     <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
                                        [ngClass]="{
                                            'bg-cyan-500/10 text-cyan-400 border-cyan-500/20': op.type === 'DEPOSIT',
                                            'bg-purple-500/10 text-purple-400 border-purple-500/20': op.type === 'WITHDRAW',
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20': op.type === 'TRANSFER'
                                        }">
                                        {{ op.type }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 font-mono text-xs text-slate-300">
                                    {{ op.sourceAccountNumber }}
                                    <div *ngIf="op.destinationAccountNumber" class="text-slate-500 mt-1">
                                        <i class="fa-solid fa-arrow-right text-[10px] mr-1"></i> {{ op.destinationAccountNumber }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-right font-bold text-white text-lg">
                                    {{ op.amount | currency }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button (click)="approve(op.id)" class="w-8 h-8 rounded-full bg-green-500/20 hover:bg-green-500/40 text-green-400 flex items-center justify-center transition-colors" title="Approve">
                                            <i class="fa-solid fa-check"></i>
                                        </button>
                                        <button (click)="reject(op.id)" class="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center transition-colors" title="Reject">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr *ngIf="pendingOperations.length === 0">
                                <td colspan="5" class="px-6 py-20 text-center">
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 text-2xl">
                                            <i class="fa-solid fa-check-double"></i>
                                        </div>
                                        <div class="text-slate-500">No pending operations to review.</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
      </main>
    </body>
  `
})
export class AgentDashboardComponent implements OnInit {
  pendingOperations: OperationResponse[] = [];

  constructor(
    private agentService: AgentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPendingOperations();
  }

  loadPendingOperations() {
    this.agentService.findPendingOperations().subscribe(ops => {
      this.pendingOperations = ops;
    });
  }

  approve(id: string) {
    if(confirm('Are you sure you want to approve this operation?')) {
        this.agentService.approveOperation(id).subscribe(() => this.loadPendingOperations());
    }
  }

  reject(id: string) {
     if(confirm('Are you sure you want to reject this operation?')) {
        this.agentService.rejectOperation(id).subscribe(() => this.loadPendingOperations());
     }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
