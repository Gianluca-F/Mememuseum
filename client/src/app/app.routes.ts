import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';

import { LogoutComponent } from './logout/logout';
//import { authGuard } from './_guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Meme Museum'
  }, {
    path: 'login',
    component: LoginComponent,
    title: 'Login | Meme Museum'
  }, {
    path: 'signup',
    component: SignupComponent,
    title: 'Signup | Meme Museum'
  }, {
    path: 'logout',
    component: LogoutComponent,
    title: 'Logout | Meme Museum',
    //canActivate: [authGuard]
  }, {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];