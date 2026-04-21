import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ClassesService } from '../../core/services/classes.service';
import { FitnessClass } from '../../core/models/class.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  bookedClasses: FitnessClass[] = [];
  loading = false;

  constructor(public auth: AuthService, private classesService: ClassesService) {}

  ngOnInit(): void {
    this.loadBookedClasses();
  }

  loadBookedClasses(): void {
    this.loading = true;
    this.classesService.getClasses().subscribe({
      next: (classes) => {
        this.bookedClasses = classes
          .filter((item) => this.classesService.isBooked(item.id))
          .sort((a, b) => `${a.day}-${a.time}`.localeCompare(`${b.day}-${b.time}`));
        this.loading = false;
      },
      error: () => {
        this.bookedClasses = [];
        this.loading = false;
      }
    });
  }

  get initials(): string {
    const username = this.auth.getUsername() ?? 'User';
    return username.slice(0, 2).toUpperCase();
  }
}