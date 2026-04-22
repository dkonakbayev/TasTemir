import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ClassesService } from '../../core/services/classes.service';
import { FitnessClass } from '../../core/models/class.model';

interface DateOption {
  value: string;
  label: string;
  dayLabel: string;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  classes: FitnessClass[] = [];
  filteredClasses: FitnessClass[] = [];
  loading = false;

  selectedDate = '';
  selectedDirection = 'All';
  selectedTrainer = 'All';

  dateOptions: DateOption[] = [];
  directions: string[] = [];
  trainers: string[] = [];
  pendingBookingIds = new Set<number>();

  constructor(public classesService: ClassesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.directions = this.classesService.getDirections();
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    this.classesService.getClasses().subscribe({
      next: (data) => {
        this.classes = [...data].sort(
          (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        );
        this.trainers = this.classesService.getTrainers();
        this.buildDateOptions();
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.classes = [];
        this.filteredClasses = [];
        this.dateOptions = [];
        this.loading = false;
      }
    });
  }

  buildDateOptions(): void {
    const seen = new Set<string>();
    this.dateOptions = this.classes
      .filter(item => {
        if (seen.has(item.dateKey)) {
          return false;
        }
        seen.add(item.dateKey);
        return true;
      })
      .map(item => ({
        value: item.dateKey,
        label: item.dateLabel,
        dayLabel: item.dayLabel
      }));

    if (!this.dateOptions.length) {
      this.selectedDate = '';
      return;
    }

    const selectedStillExists = this.dateOptions.some(option => option.value === this.selectedDate);
    if (!selectedStillExists) {
      this.selectedDate = this.dateOptions[0].value;
    }
  }

  setDate(date: string): void {
    this.selectedDate = date;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredClasses = this.classes
      .filter(item => !this.selectedDate || item.dateKey === this.selectedDate)
      .filter(item => this.selectedDirection === 'All' || item.direction === this.selectedDirection)
      .filter(item => this.selectedTrainer === 'All' || item.trainer === this.selectedTrainer)
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.selectedDirection = 'All';
    this.selectedTrainer = 'All';
    this.selectedDate = this.dateOptions[0]?.value ?? '';
    this.applyFilters();
  }

  book(id: number): void {
    if (this.isPending(id)) {
      return;
    }

    this.pendingBookingIds.add(id);
    this.classesService.bookClass(id)
      .pipe(finalize(() => this.pendingBookingIds.delete(id)))
      .subscribe({
        next: () => {
          this.updateLocalClass(id, 1);
          this.applyFilters();
        },
        error: () => {
          this.loadClasses();
        }
      });
  }

  cancel(id: number): void {
    if (this.isPending(id)) {
      return;
    }

    this.pendingBookingIds.add(id);
    this.classesService.cancelBooking(id)
      .pipe(finalize(() => this.pendingBookingIds.delete(id)))
      .subscribe({
        next: () => {
          this.updateLocalClass(id, -1);
          this.applyFilters();
        },
        error: () => {
          this.loadClasses();
        }
      });
  }

  isBooked(id: number): boolean {
    return this.classesService.isBooked(id);
  }

  isPending(id: number): boolean {
    return this.pendingBookingIds.has(id);
  }

  freeSpots(item: FitnessClass): number {
    return item.capacity - item.bookedCount;
  }

  private updateLocalClass(id: number, diff: number): void {
    this.classes = this.classes.map((item) => {
      if (item.id !== id) {
        return item;
      }

      return {
        ...item,
        bookedCount: Math.max(0, item.bookedCount + diff)
      };
    });
  }
}
