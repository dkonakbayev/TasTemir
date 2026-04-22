import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(public auth: AuthService) {}

  get initials(): string {
    const username = this.auth.getUsername() ?? 'User';
    return username.slice(0, 2).toUpperCase();
  }
}
