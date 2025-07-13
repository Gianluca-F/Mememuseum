import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './_layout/main-layout/main-layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayoutComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {}
