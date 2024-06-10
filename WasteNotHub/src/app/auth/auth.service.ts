import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Your API URL
  private token: string = '';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response: any) => {
          this.token = response.token;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', this.token);
          }
          this.loggedIn.next(true);
        })
      );
  }

  logout() {
    this.token = '';
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string {
    return this.token;
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  checkToken() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.loggedIn.next(true);
      }
    }
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username,
      password,
    });
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}
