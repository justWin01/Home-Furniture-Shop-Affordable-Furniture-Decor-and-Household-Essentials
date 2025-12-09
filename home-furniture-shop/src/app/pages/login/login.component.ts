import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // CUSTOMER LOGIN
  email = '';
  password = '';

  // SIGN UP MODAL
  isSignUpOpen = false;
  signupName = '';
  signupEmail = '';
  signupPassword = '';
  signupContact = '';
  signupAddress = '';

  // ADMIN MODAL
  isAdminModalOpen = false;
  adminMode: 'login' | 'register' = 'login';

  adminEmail = '';
  adminPassword = '';

  adminRegisterName = '';
  adminRegisterEmail = '';
  adminRegisterPassword = '';

  constructor(private userService: UserService, private router: Router) {}

  // RESET ADMIN FIELDS
  private resetAdminFields() {
    this.adminEmail = '';
    this.adminPassword = '';
    this.adminRegisterName = '';
    this.adminRegisterEmail = '';
    this.adminRegisterPassword = '';
  }

  // ====================== CUSTOMER LOGIN ======================
  onLogin() {
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter email and password.',
      });
      return;
    }

    this.userService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        // Check backend response carefully
        if (res.user) {
          // Map backend user to frontend fields
          const user = {
            fullname: res.user.full_name || res.user.name || '',
            address: res.user.address || '',
            email: res.user.email
          };

          // Store token, role, and full user in localStorage

          localStorage.setItem('role', res.role || '');
          localStorage.setItem('user', JSON.stringify(user));

          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            timer: 1500,
            showConfirmButton: false
          });

          // Navigate to customer home
          this.router.navigate(['/customer/homecustomer']);
        } else {
          // Backend response did not contain token/user → treat as failed login
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: res.message || 'Invalid email or password',
          });
        }
      },
      error: (err: any) => {
        // Network or server error
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: err.error?.message || err.message || 'Server error',
        });
      }
    });
  }



  // ====================== CUSTOMER SIGN UP ======================
  openSignUpModal() { this.isSignUpOpen = true; }
  closeSignUpModal() { this.isSignUpOpen = false; }

  onSignUp() {
    if (!this.signupName || !this.signupEmail || !this.signupPassword || !this.signupContact || !this.signupAddress) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Fields',
        text: 'Please fill all fields.',
      });
      return;
    }

    const data = {
      full_name: this.signupName,
      email: this.signupEmail,
      password: this.signupPassword,
      contact_number: this.signupContact,
      address: this.signupAddress
    };

    this.userService.signup(data).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'You can now log in.',
        });
        this.closeSignUpModal();
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Sign Up Failed',
          text: err.error?.message || err.message
        });
      }
    });
  }

  // ====================== FORGOT PASSWORD ======================
  openForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  // ====================== ADMIN MODAL ======================
  openAdminModal(mode: 'login' | 'register' = 'login') {
    this.isAdminModalOpen = true;
    this.adminMode = mode;
    this.resetAdminFields();
  }

  closeAdminModal() {
    this.isAdminModalOpen = false;
    this.resetAdminFields();
  }

  toggleAdminMode() {
    this.adminMode = this.adminMode === 'login' ? 'register' : 'login';
    this.resetAdminFields();
  }

  // ====================== ADMIN LOGIN ======================
  onAdminLogin() {
    if (!this.adminEmail || !this.adminPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter admin email and password.',
      });
      return;
    }

    this.userService.adminLogin(this.adminEmail, this.adminPassword).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Admin Login Successful!',
          timer: 1500,
          showConfirmButton: false
        });

        if (res.token) localStorage.setItem('admin_token', res.token);

        this.closeAdminModal();
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Admin Login Failed',
          text: err.error?.message || err.message
        });
      }
    });
  }

  // ====================== ADMIN REGISTER ======================
  onAdminRegister() {
    if (!this.adminRegisterName || !this.adminRegisterEmail || !this.adminRegisterPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill all fields.',
      });
      return;
    }

    const data = {
      full_name: this.adminRegisterName,
      email: this.adminRegisterEmail,
      password: this.adminRegisterPassword
    };


  }
}
