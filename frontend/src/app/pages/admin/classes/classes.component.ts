import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassesService } from '../../../core/services/classes.service';
import { FitnessClass, FitnessDayKey, FitnessDirection } from '../../../core/models/class.model';

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
  hallOptions: string[] = [];
  formError = '';

  directions: FitnessDirection[] = ['Boxing', 'Yoga', 'Strength', 'Cycling', 'Pilates', 'Dance Fit'];
  days: { key: FitnessDayKey; label: string; date: string }[] = [
    { key: 'mon', label: 'Mon', date: '13 Apr' },
    { key: 'tue', label: 'Tue', date: '14 Apr' },
    { key: 'wed', label: 'Wed', date: '15 Apr' },
    { key: 'thu', label: 'Thu', date: '16 Apr' },
    { key: 'fri', label: 'Fri', date: '17 Apr' },
    { key: 'sat', label: 'Sat', date: '18 Apr' },
    { key: 'sun', label: 'Sun', date: '19 Apr' }
  ];

  form: {
    title: string;
    direction: FitnessDirection;
    trainer: string;
    hall: string;
    day: FitnessDayKey;
    time: string;
    capacity: number;
    duration: number;
    description: string;
  } = {
    title: '',
    direction: 'Boxing',
    trainer: '',
    hall: '',
    day: 'mon',
    time: '07:00',
    capacity: 12,
    duration: 50,
    description: ''
  };

  constructor(private classesService: ClassesService) {}

  ngOnInit(): void {
    this.loadTrainerOptions();
    this.loadHallOptions();
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
    this.classesService.getClasses().subscribe(data => {
      this.classes = data.sort((a, b) =>`${a.day}-${a.time}`.localeCompare(`${b.day}-${b.time}`)
);
    });
  }

  loadHallOptions(): void {
    this.classesService.getHallOptions().subscribe({
      next: (halls) => {
        this.hallOptions = halls;
        if (!this.form.hall && halls.length > 0) {
          this.form.hall = halls[0];
        }
      },
      error: () => {
        this.hallOptions = ['Main hall', 'Hall A', 'Hall B'];
        if (!this.form.hall) {
          this.form.hall = this.hallOptions[0];
        }
      }
    });
  }

  addClass(): void {
    this.formError = '';
    const selectedDay = this.days.find(day => day.key === this.form.day);
    if (!selectedDay) {
      return;
    }

    this.classesService.addClass({
      title: this.form.title,
      direction: this.form.direction,
      trainer: this.form.trainer,
      hall: this.form.hall,
      day: this.form.day,
      dayLabel: selectedDay.label,
      dateLabel: selectedDay.date,
      time: this.form.time,
      duration: this.form.duration,
      capacity: this.form.capacity,
      description: this.form.description
    }).subscribe({
      next: () => {
        this.loadClasses();
        this.form = {
          title: '',
          direction: 'Boxing',
          trainer: this.trainerOptions[0] ?? '',
          hall: this.hallOptions[0] ?? '',
          day: 'mon',
          time: '07:00',
          capacity: 12,
          duration: 50,
          description: ''
        };
      },
      error: (err) => {
        this.formError = err?.error?.error || err?.message || 'Failed to add class.';
      }
    });
  }

  deleteClass(id: number): void {
    this.classesService.deleteClass(id).subscribe(() => this.loadClasses());
  }

  freeSpots(item: FitnessClass): number {
    return item.capacity - item.bookedCount;
  }
}