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
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPassword: boolean = false;
  isLoading: Observable<boolean> = of(false);
  payload: LoginRequest = {
    email: '',
    password: ''
  };
  constructor(private authService: AuthService) {
    this.isLoading = this.authService.isLoading$;
  }
  submit() {
    this.authService.login(this.payload);
  }
}
