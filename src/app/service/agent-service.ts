import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelper } from '../helper/api-helper';
import { OperationResponse } from '../dto/request/client.interface';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService extends ApiHelper {
  constructor(http: HttpClient) {
    super(http);
  }

  findPendingOperations(): Observable<OperationResponse[]> {
    this.isLoading.next(true);
    return this.http.get<OperationResponse[]>(`${this.api}/agent/operations/pending`).pipe(
      finalize(() => this.isLoading.next(false))
    );
  }

  approveOperation(id: string): Observable<OperationResponse> {
     this.isLoading.next(true);
     return this.http.put<OperationResponse>(`${this.api}/agent/operations/${id}/approve`, {}).pipe(
       finalize(() => this.isLoading.next(false))
     );
  }

  rejectOperation(id: string): Observable<OperationResponse> {
     this.isLoading.next(true);
     return this.http.put<OperationResponse>(`${this.api}/agent/operations/${id}/reject`, {}).pipe(
       finalize(() => this.isLoading.next(false))
     );
  }
}
