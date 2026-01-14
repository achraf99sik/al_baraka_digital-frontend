import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHelper } from '../helper/api-helper';
import { CreateUserRequest, UserResponse } from '../dto/request/admin.interface';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiHelper {
  constructor(http: HttpClient) {
    super(http);
  }

  createUser(payload: CreateUserRequest): Observable<UserResponse> {
    this.isLoading.next(true);
    return this.http.post<UserResponse>(`${this.api}/admin/users`, payload).pipe(
      finalize(() => this.isLoading.next(false))
    );
  }

  findAllUsers(): Observable<UserResponse[]> {
    this.isLoading.next(true);
    return this.http.get<UserResponse[]>(`${this.api}/admin/users`).pipe(
      finalize(() => this.isLoading.next(false))
    );
  }

  deleteUser(id: string): Observable<void> {
    this.isLoading.next(true);
    return this.http.delete<void>(`${this.api}/admin/users/${id}`).pipe(
      finalize(() => this.isLoading.next(false))
    );
  }
}
