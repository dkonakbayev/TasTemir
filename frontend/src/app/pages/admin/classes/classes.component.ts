import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ClassesService } from '../../../core/services/classes.service';
import { FitnessClass, FitnessDirection } from '../../../core/models/class.model';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css'
})
export class ClassesComponent implements OnInit {
  classes: FitnessClass[] = [];
  trainerOptions: string[] = [];
  formError = '';
  isAdding = false;
  deletingIds: number[] = [];

  directions: FitnessDirection[] = ['Boxing', 'Yoga', 'Strength', 'Cycling', 'Pilates', 'Dance Fit'];

  form: {
    title: string;
    direction: FitnessDirection;
    trainer: string;
    hall: string;
    date: string;
    time: string;
    capacity: number;
    duration: number;
    description: string;
  } = {
    title: '',
    direction: 'Boxing',
    trainer: '',
    hall: '',
    date: this.getTodayDate(),
    time: '07:00',
    capacity: 12,
    duration: 50,
    description: ''
  };

  constructor(
    private classesService: ClassesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTrainerOptions();
    this.loadClasses();
  }

  loadTrainerOptions(): void {
    this.classesService.getTrainerNames().subscribe({
      next: (trainers) => {
        this.trainerOptions = trainers;
        if (!this.form.trainer && trainers.length > 0) {
          this.form.trainer = trainers[0];
        }
      },
      error: () => {
        this.formError = 'Failed to load trainers. Please refresh the page.';
      }
    });
  }

  loadClasses(): void {
    this.classesService.getClasses().subscribe({
      next: (data) => {
        this.classes = this.sortClasses(data);
        this.cdr.detectChanges();
      },
      error: () => {
        this.formError = 'Failed to load classes.';
      }
    });
  }

  addClass(): void {
    if (this.isAdding) {
      return;
    }

    this.formError = '';
    this.isAdding = true;

    this.classesService
      .addClass({
        title: this.form.title.trim(),
        direction: this.form.direction,
        trainer: this.form.trainer,
        hall: this.form.hall.trim(),
        date: this.form.date,
        day: 'mon',
        dayLabel: '',
        dateLabel: '',
        time: this.form.time,
        duration: this.form.duration,
        capacity: this.form.capacity,
        description: this.form.description.trim()
      })
      .pipe(finalize(() => (this.isAdding = false)))
      .subscribe({
        next: () => {
          this.resetForm();
          this.loadClasses();
        },
        error: (err) => {
          this.formError = err?.error?.error || err?.message || 'Failed to add class.';
        }
      });
  }

  deleteClass(id: number): void {
    if (this.deletingIds.includes(id)) {
      return;
    }

    const previousClasses = [...this.classes];
    this.deletingIds = [...this.deletingIds, id];
    this.classes = this.classes.filter((item) => item.id !== id);

    this.classesService
      .deleteClass(id)
      .pipe(finalize(() => {
        this.deletingIds = this.deletingIds.filter((itemId) => itemId !== id);
      }))
      .subscribe({
        next: () => {
          this.loadClasses();
        },
        error: () => {
          this.classes = previousClasses;
          this.formError = 'Failed to delete class.';
        }
      });
  }

  isDeleting(id: number): boolean {
    return this.deletingIds.includes(id);
  }

  freeSpots(item: FitnessClass): number {
    return item.capacity - item.bookedCount;
  }

  trackById(_: number, item: FitnessClass): number {
    return item.id;
  }

  private resetForm(): void {
    this.form = {
      title: '',
      direction: 'Boxing',
      trainer: this.trainerOptions[0] ?? '',
      hall: this.form.hall,
      date: this.getTodayDate(),
      time: '07:00',
      capacity: 12,
      duration: 50,
      description: ''
    };
  }

  private sortClasses(items: FitnessClass[]): FitnessClass[] {
    return [...items].sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
