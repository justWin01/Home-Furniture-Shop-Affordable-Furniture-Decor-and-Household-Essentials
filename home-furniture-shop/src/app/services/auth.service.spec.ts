import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInUser = false;

  constructor() {}

  login() {
    this.isLoggedInUser = true;
  }

  logout() {
    this.isLoggedInUser = false;
  }

  isLoggedIn() {
    return this.isLoggedInUser;
  }
}
