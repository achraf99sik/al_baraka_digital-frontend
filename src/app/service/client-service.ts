import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelper } from '../helper/api-helper';
import { OperationRequest, OperationResponse } from '../dto/request/client.interface';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends ApiHelper {
  constructor(http: HttpClient) {
    super(http);
  }

  createOperation(payload: OperationRequest): Observable<OperationResponse> {
    this.isLoading.next(true);
    return this.http.post<OperationResponse>(`${this.api}/client/operations`, payload).pipe(
      finalize(() => this.isLoading.next(false))
    );
  }

  findAll(): Observable<OperationResponse[]> {
    this.isLoading.next(true);
    return this.http.get<OperationResponse[]>(`${this.api}/client/operations`).pipe(
      finalize(() => this.isLoading.next(false))
    );
  }

  uploadDocument(id: string, file: File): Observable<void> {
    this.isLoading.next(true);
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.api}/client/operations/${id}/document`, formData).pipe(
      finalize(() => this.isLoading.next(false))
    );
  }
}
