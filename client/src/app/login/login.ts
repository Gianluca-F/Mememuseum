import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth/auth';
import { AuthBackendService } from '../_services/auth/auth-backend';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  authBackendService = inject(AuthBackendService);
  authService = inject(AuthService);
  submitted = false;
  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    pass: new FormControl('', [Validators.required])
  })

  handleLogin() {
    this.submitted = true;
    if(this.loginForm.invalid){
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      this.authBackendService.login(
        this.loginForm.value.user as string,
        this.loginForm.value.pass as string,
      ).subscribe({
        next: (res) => {
          const token = res.token;
          this.authService.updateToken(token).then(() => {
            this.toastr.success(`You have successfully logged in`, `Welcome back ${this.loginForm.value.user}!`);
            setTimeout(() => {this.router.navigateByUrl("/")}, 10);
          });
        },
        error: (err) => {
          if (err.status === 401) {
            this.toastr.error("The username or password you entered was incorrect", "Oops! Could not log in");
            return;
          }
          this.toastr.error("An unexpected error occurred (" + err.status + ")", "Oops! Could not log in");
        },
        complete: () => {
        }
      })
    }
  }
}
