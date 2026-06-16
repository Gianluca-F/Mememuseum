import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { ExploreComponent } from './explore/explore';
import { MemeComponent } from './meme/meme';
import { UploadMemeComponent } from './upload-meme/upload-meme';
import { EditMemeComponent } from './edit-meme/edit-meme';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';

import { LogoutComponent } from './logout/logout';
import { authGuard } from './_guards/auth/auth-guard';
import { guestGuard } from './_guards/guest/guest-guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Meme Museum'
  }, {
    path: 'explore',
    component: ExploreComponent,
    title: 'Explore | Meme Museum'
  }, {
    path: 'meme-of-the-day',
    component: MemeComponent,
    title: 'Meme of the Day | Meme Museum'
  }, {
    path: 'memes/:id',
    component: MemeComponent,
    title: 'Meme | Meme Museum'
  }, {
    path: 'memes/:id/edit',
    component: EditMemeComponent,
    title: 'Edit Meme | Meme Museum',
    canActivate: [authGuard]
  }, {
    path: 'upload',
    component: UploadMemeComponent,
    title: 'Upload Meme | Meme Museum',
    canActivate: [authGuard]
  }, {
    path: 'login',
    component: LoginComponent,
    title: 'Login | Meme Museum',
    canActivate: [guestGuard]
  }, {
    path: 'signup',
    component: SignupComponent,
    title: 'Signup | Meme Museum',
    canActivate: [guestGuard]
  }, {
    path: 'logout',
    component: LogoutComponent,
    title: 'Logout | Meme Museum',
    canActivate: [authGuard]
  }, {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];