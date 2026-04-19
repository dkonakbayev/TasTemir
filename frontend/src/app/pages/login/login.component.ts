import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService, LoginPayload } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: LoginPayload = { username: '', password: '' };
  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.loading = true;

    this.auth.login(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(this.auth.isAdmin() ? ['/admin/classes'] : ['/schedule']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.detail ?? 'Invalid credentials. Please try again.';
      }
    });
  }
}