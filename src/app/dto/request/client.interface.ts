export type OperationType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
export type OperationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface OperationRequest {
  type: OperationType;
  amount: number;
  destinationAccountNumber?: string;
}

export interface OperationResponse {
  id: string;
  type: OperationType;
  amount: number;
  status: OperationStatus;
  createdAt: string;
  validatedAt: string | null;
  sourceAccountNumber: string;
  destinationAccountNumber: string | null;
}
