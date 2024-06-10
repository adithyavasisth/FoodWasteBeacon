import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'WasteNotHub';
  isLoggedIn$: Observable<boolean> = new Observable<boolean>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkToken();
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }
}
