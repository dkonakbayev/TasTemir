import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassesService } from '../../core/services/classes.service';
import { FitnessClass, FitnessDayKey } from '../../core/models/class.model';

interface DayOption {
  key: FitnessDayKey;
  short: string;
  date: string;
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

  selectedDay: FitnessDayKey = 'mon';
  selectedDirection = 'All';
  selectedTrainer = 'All';
  selectedHall = 'All';

  dayOptions: DayOption[] = [
    { key: 'mon', short: 'Mon', date: '13' },
    { key: 'tue', short: 'Tue', date: '14' },
    { key: 'wed', short: 'Wed', date: '15' },
    { key: 'thu', short: 'Thu', date: '16' },
    { key: 'fri', short: 'Fri', date: '17' },
    { key: 'sat', short: 'Sat', date: '18' },
    { key: 'sun', short: 'Sun', date: '19' }
  ];

  directions: string[] = [];
  trainers: string[] = [];
  halls: string[] = [];

  constructor(public classesService: ClassesService) {}

  ngOnInit(): void {
    this.directions = this.classesService.getDirections();
    this.loadClasses();
  }

  loadClasses(): void {
    this.classesService.getClasses().subscribe(data => {
      this.classes = data;
      this.trainers = this.classesService.getTrainers();
      this.halls = this.classesService.getHalls();
      this.applyFilters();
    });
  }

  setDay(day: FitnessDayKey): void {
    this.selectedDay = day;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredClasses = this.classes
      .filter(item => item.day === this.selectedDay)
      .filter(item =>
        this.selectedDirection === 'All' || item.direction === this.selectedDirection
      )
      .filter(item =>
        this.selectedTrainer === 'All' || item.trainer === this.selectedTrainer
      )
      .filter(item =>
        this.selectedHall === 'All' || item.hall === this.selectedHall
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  resetFilters(): void {
    this.selectedDirection = 'All';
    this.selectedTrainer = 'All';
    this.selectedHall = 'All';
    this.applyFilters();
  }

  book(id: number): void {
    this.classesService.bookClass(id).subscribe(() => this.loadClasses());
  }

  cancel(id: number): void {
    this.classesService.cancelBooking(id).subscribe(() => this.loadClasses());
  }

  isBooked(id: number): boolean {
    return this.classesService.isBooked(id);
  }

  freeSpots(item: FitnessClass): number {
    return item.capacity - item.bookedCount;
  }
}