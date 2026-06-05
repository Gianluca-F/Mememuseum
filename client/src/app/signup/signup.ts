import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth/auth';
import { AuthBackendService } from '../_services/auth/auth-backend';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  authRestService = inject(AuthBackendService);
  authService = inject(AuthService);
  submitted = false;
  signupForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    pass: new FormControl('', [
      Validators.required, 
      Validators.minLength(4), 
      Validators.maxLength(16)])
  })
  
  handleSignup() {
    this.submitted = true;
    if(this.signupForm.invalid){
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      this.authRestService.signup(
        this.signupForm.value.user as string,
        this.signupForm.value.pass as string,
      ).subscribe({
        next: (res) => {
          const token = res.token;
          this.authService.updateToken(token).then(() => {
            this.toastr.success(`You have successfully signed up`, `Welcome ${this.signupForm.value.user}!`);
            setTimeout(() => {this.router.navigateByUrl("/")}, 10);
          });
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastr.error("The password you selected was too weak", "Oops! Could not create a new user");
            return;
          }
          if (err.status === 409) {
            this.toastr.error("The username you selected was already taken", "Oops! Could not create a new user");
            return;
          }
          this.toastr.error("An unexpected error occurred (" + err.status + ")", "Oops! Could not create a new user");
        },
        complete: () => {
        }
      })
    }
  }
}
