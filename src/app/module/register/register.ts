import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterRequest } from '../../dto/request/register-request';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  showPassword: boolean = false;
  payload: RegisterRequest = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'CLIENT'
  };
}
