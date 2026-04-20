import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FitnessClass, FitnessDayKey } from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private classes: FitnessClass[] = [
    {
      id: 1,
      title: 'Morning Boxing',
      direction: 'Boxing',
      trainer: 'Aibek Dzhaksybekov',
      hall: 'Hall A',
      day: 'mon',
      dayLabel: 'Mon',
      dateLabel: '13 Apr',
      time: '07:00',
      duration: 50,
      capacity: 15,
      bookedCount: 8,
      description: 'High-energy boxing class focused on cardio, technique, and endurance.'
    },
    {
      id: 2,
      title: 'Yoga Flow',
      direction: 'Yoga',
      trainer: 'Salima Nurova',
      hall: 'Zen Room',
      day: 'mon',
      dayLabel: 'Mon',
      dateLabel: '13 Apr',
      time: '08:00',
      duration: 50,
      capacity: 14,
      bookedCount: 6,
      description: 'Gentle stretching, breathing, and balance practice for all levels.'
    },
    {
      id: 3,
      title: 'Strength Base',
      direction: 'Strength',
      trainer: 'Nikita Voronov',
      hall: 'Power Hall',
      day: 'mon',
      dayLabel: 'Mon',
      dateLabel: '13 Apr',
      time: '10:00',
      duration: 50,
      capacity: 12,
      bookedCount: 7,
      description: 'Full-body strength session with progressive overload and proper technique.'
    },
    {
      id: 4,
      title: 'Cycling Burn',
      direction: 'Cycling',
      trainer: 'Aruzhan Bek',
      hall: 'Cycle Studio',
      day: 'tue',
      dayLabel: 'Tue',
      dateLabel: '14 Apr',
      time: '07:30',
      duration: 50,
      capacity: 16,
      bookedCount: 10,
      description: 'Fast-paced indoor ride with interval blocks and music-driven pace changes.'
    },
    {
      id: 5,
      title: 'Pilates Core',
      direction: 'Pilates',
      trainer: 'Dana Omir',
      hall: 'Balance Hall',
      day: 'tue',
      dayLabel: 'Tue',
      dateLabel: '14 Apr',
      time: '09:00',
      duration: 50,
      capacity: 10,
      bookedCount: 4,
      description: 'Core stability, posture, and controlled movement training.'
    },
    {
      id: 6,
      title: 'Dance Fit Energy',
      direction: 'Dance Fit',
      trainer: 'Madina Bekova',
      hall: 'Dance Hall',
      day: 'wed',
      dayLabel: 'Wed',
      dateLabel: '15 Apr',
      time: '18:00',
      duration: 50,
      capacity: 20,
      bookedCount: 13,
      description: 'Cardio dance session with easy combos and club-level energy.'
    },
    {
      id: 7,
      title: 'Boxing Technique',
      direction: 'Boxing',
      trainer: 'Aibek Dzhaksybekov',
      hall: 'Hall A',
      day: 'thu',
      dayLabel: 'Thu',
      dateLabel: '16 Apr',
      time: '19:00',
      duration: 50,
      capacity: 15,
      bookedCount: 11,
      description: 'Focus on combinations, footwork, pads, and coordination.'
    },
    {
      id: 8,
      title: 'Sunrise Yoga',
      direction: 'Yoga',
      trainer: 'Salima Nurova',
      hall: 'Zen Room',
      day: 'fri',
      dayLabel: 'Fri',
      dateLabel: '17 Apr',
      time: '07:00',
      duration: 50,
      capacity: 14,
      bookedCount: 5,
      description: 'Light morning flow to reset, stretch, and wake up the body.'
    },
    {
      id: 9,
      title: 'Leg Power Strength',
      direction: 'Strength',
      trainer: 'Nikita Voronov',
      hall: 'Power Hall',
      day: 'sat',
      dayLabel: 'Sat',
      dateLabel: '18 Apr',
      time: '11:00',
      duration: 50,
      capacity: 12,
      bookedCount: 9,
      description: 'Lower-body and glute-focused strength workout.'
    },
    {
      id: 10,
      title: 'Weekend Dance Fit',
      direction: 'Dance Fit',
      trainer: 'Madina Bekova',
      hall: 'Dance Hall',
      day: 'sun',
      dayLabel: 'Sun',
      dateLabel: '19 Apr',
      time: '12:00',
      duration: 50,
      capacity: 20,
      bookedCount: 15,
      description: 'Weekend class with upbeat choreography and cardio blocks.'
    },
    {
      id: 11,
      title: 'Pilates Stretch',
      direction: 'Pilates',
      trainer: 'Dana Omir',
      hall: 'Balance Hall',
      day: 'wed',
      dayLabel: 'Wed',
      dateLabel: '15 Apr',
      time: '09:30',
      duration: 50,
      capacity: 10,
      bookedCount: 3,
      description: 'Mobility and posture work with pilates fundamentals.'
    },
    {
      id: 12,
      title: 'Cycling Endurance',
      direction: 'Cycling',
      trainer: 'Aruzhan Bek',
      hall: 'Cycle Studio',
      day: 'fri',
      dayLabel: 'Fri',
      dateLabel: '17 Apr',
      time: '18:30',
      duration: 50,
      capacity: 16,
      bookedCount: 12,
      description: 'Longer effort blocks to build stamina and leg power.'
    }
  ];

  private myBookings: number[] = [2, 6];

  getClasses(): Observable<FitnessClass[]> {
    return of([...this.classes]);
  }

  getClassesByDay(day: FitnessDayKey): Observable<FitnessClass[]> {
    return of(this.classes.filter(item => item.day === day));
  }

  getDirections(): string[] {
    return ['All', 'Boxing', 'Yoga', 'Strength', 'Cycling', 'Pilates', 'Dance Fit'];
  }

  getTrainers(): string[] {
    const trainers = [...new Set(this.classes.map(item => item.trainer))];
    return ['All', ...trainers];
  }

  getHalls(): string[] {
    const halls = [...new Set(this.classes.map(item => item.hall))];
    return ['All', ...halls];
  }

  bookClass(classId: number): Observable<void> {
    const selected = this.classes.find(item => item.id === classId);
    if (selected && selected.bookedCount < selected.capacity && !this.myBookings.includes(classId)) {
      selected.bookedCount += 1;
      this.myBookings.push(classId);
    }
    return of(void 0);
  }

  cancelBooking(classId: number): Observable<void> {
    const selected = this.classes.find(item => item.id === classId);
    if (selected && this.myBookings.includes(classId)) {
      selected.bookedCount -= 1;
      this.myBookings = this.myBookings.filter(id => id !== classId);
    }
    return of(void 0);
  }

  isBooked(classId: number): boolean {
    return this.myBookings.includes(classId);
  }

  addClass(newClass: Omit<FitnessClass, 'id' | 'bookedCount'>): Observable<void> {
    this.classes.push({
      ...newClass,
      id: Date.now(),
      bookedCount: 0
    });
    return of(void 0);
  }

  deleteClass(id: number): Observable<void> {
    this.classes = this.classes.filter(item => item.id !== id);
    this.myBookings = this.myBookings.filter(itemId => itemId !== id);
    return of(void 0);
  }
}
