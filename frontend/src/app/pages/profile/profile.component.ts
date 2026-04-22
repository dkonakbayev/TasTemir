import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ClassesService } from '../../core/services/classes.service';
import { BookingItem } from '../../core/models/class.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  bookings: BookingItem[] = [];
  loading = false;

  constructor(
    public auth: AuthService,
    private classesService: ClassesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.classesService.getMyBookings().subscribe({
      next: (items) => {
        this.bookings = items.filter((item) => item.status === 'booked');
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.bookings = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get initials(): string {
    const username = this.auth.getUsername() ?? 'User';
    return username.slice(0, 2).toUpperCase();
  }
}
