import { environment } from '../environment/evironment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';

export abstract class ApiHelper {
  /**
   * The base API host URL from environment configuration.
   */
  protected api = environment.apiUrl;
  public isLoading = new BehaviorSubject<boolean>(false);

  /**
   * @param http Angular HttpClient for making HTTP requests.
   */
  constructor(protected http: HttpClient) {}
  /**
   * Handles an HTTP request, manages loading state, and calls a success callback.
   * @template T The type of the response expected from the request.
   * @param request$ The observable HTTP request.
   * @param onSuccess Callback to execute on successful response.
   * @param isLoading BehaviorSubject to manage loading state.
   */
  protected handleRequest<T>(
    request$: Observable<T>,
    onSuccess: (res: T) => void
  ): void {
    this.isLoading.next(true);
    request$
      .pipe(
        tap(onSuccess),
        catchError((err) => {
          console.error('API error', err);
          return throwError(() => err);
        }),
        finalize(() => this.isLoading.next(false))
      )
      .subscribe();
  }
}
