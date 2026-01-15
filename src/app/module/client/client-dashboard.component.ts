import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../service/client-service';
import { AuthService } from '../../service/auth-service';
import { OperationRequest, OperationResponse, OperationType } from '../../dto/request/client.interface';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-dashboard.component.html',
  styleUrls: []
})
export class ClientDashboardComponent implements OnInit {
  operations: OperationResponse[] = [];
  balance = 0;
  totalDeposits = 0;
  totalWithdrawals = 0;

  showModal = false;
  currentOperationType: OperationType = 'DEPOSIT';
  
  amount: number | null = null;
  destinationAccount: string = '';

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOperations();
  }

  loadOperations() {
    this.clientService.findAll().subscribe(ops => {
      this.operations = ops;
      this.calculateStats();
    });
  }

  calculateStats() {
    // This is a simplified client-side calculation. 
    // In a real app, balance usually comes from backend.
    this.balance = 0;
    this.totalDeposits = 0;
    this.totalWithdrawals = 0;

    this.operations.forEach(op => {
      if (op.status === 'APPROVED') {
        if (op.type === 'DEPOSIT') {
          this.balance += op.amount;
          this.totalDeposits += op.amount;
        } else if (op.type === 'WITHDRAW') {
          this.balance -= op.amount;
          this.totalWithdrawals += op.amount;
        } else if (op.type === 'TRANSFER') {
            // Assuming transfer out for now
            this.balance -= op.amount;
            this.totalWithdrawals += op.amount; 
        }
      }
    });
  }

  openModal(type: OperationType) {
    this.currentOperationType = type;
    this.showModal = true;
    this.amount = null;
    this.destinationAccount = '';
  }

  closeModal() {
    this.showModal = false;
  }

  submitOperation() {
    if (!this.amount) return;

    const payload: OperationRequest = {
        type: this.currentOperationType,
        amount: this.amount,
        destinationAccountNumber: this.destinationAccount || undefined
    };

    this.clientService.createOperation(payload).subscribe({
        next: () => {
            this.closeModal();
            this.loadOperations();
        },
        error: (err) => alert('Operation failed')
    });
  }

  selectedFile: File | null = null;
  uploadingOperationId: string | null = null;

  onFileSelected(event: any, operationId: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadingOperationId = operationId;
      this.uploadDocument();
    }
  }

  uploadDocument() {
    if (this.selectedFile && this.uploadingOperationId) {
      this.clientService.uploadDocument(this.uploadingOperationId, this.selectedFile).subscribe({
        next: () => {
          alert('Document uploaded successfully');
          this.selectedFile = null;
          this.uploadingOperationId = null;
          this.loadOperations(); // Reload to perhaps show status update if applicable
        },
        error: () => alert('Failed to upload document')
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
