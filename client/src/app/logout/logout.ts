import { Component,inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth/auth';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.html',
  styleUrls: ['./logout.scss']
})
export class LogoutComponent {
  router = inject(Router);
  toastr = inject(ToastrService);
  authService = inject(AuthService);

  ngOnInit() {{
      this.toastr.warning(`Come back soon, ${this.authService.userName()}!`, "You have been logged out");
      setTimeout(() => {
        this.authService.logout();
        this.router.navigateByUrl("/");
      }) 
    }
  }

}
