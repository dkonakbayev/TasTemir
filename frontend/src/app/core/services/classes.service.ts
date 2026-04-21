import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, throwError } from 'rxjs';
import { FitnessClass, FitnessDayKey } from '../models/class.model';

interface ApiFitnessClass {
  id: number;
  title: string;
  description: string;
  datetime: string;
  capacity: number;
  direction: string;
  hall?: string;
  trainer: number;
  trainer_name: string;
  booked_count: number;
}

interface ApiBooking {
  id: number;
  fitness_class: number;
  status: 'booked' | 'cancelled';
}

interface ApiTrainer {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private readonly API = 'http://127.0.0.1:8000/api';
  private bookingIdByClassId = new Map<number, number>();
  private bookedClassIds = new Set<number>();
  private lastLoadedClasses: FitnessClass[] = [];

  constructor(private http: HttpClient) {}

  getClasses(): Observable<FitnessClass[]> {
    return forkJoin({
      classes: this.http.get<ApiFitnessClass[]>(`${this.API}/classes/`),
      bookings: this.http.get<ApiBooking[]>(`${this.API}/my-bookings/`)
    }).pipe(
      map(({ classes, bookings }) => {
        this.bookingIdByClassId.clear();
        this.bookedClassIds.clear();
        bookings
          .filter((booking) => booking.status === 'booked')
          .forEach((booking) => {
            this.bookingIdByClassId.set(booking.fitness_class, booking.id);
            this.bookedClassIds.add(booking.fitness_class);
          });

        const mapped = classes.map((item) => this.mapApiClass(item));
        this.lastLoadedClasses = mapped;
        return mapped;
      })
    );
  }

  getClassesByDay(day: FitnessDayKey): Observable<FitnessClass[]> {
    return this.getClasses().pipe(map((items) => items.filter((item) => item.day === day)));
  }

  getDirections(): string[] {
    return ['All', 'Boxing', 'Yoga', 'Strength', 'Cycling', 'Pilates', 'Dance Fit'];
  }

  getTrainers(): string[] {
    const trainers = [...new Set(this.lastLoadedClasses.map((item) => item.trainer))];
    return ['All', ...trainers];
  }

  getHalls(): string[] {
    const halls = [...new Set(this.lastLoadedClasses.map((item) => item.hall))];
    return ['All', ...halls];
  }

  getTrainerNames(): Observable<string[]> {
    return this.http.get<ApiTrainer[]>(`${this.API}/trainers/`).pipe(
      map((trainers) => trainers.map((trainer) => trainer.name))
    );
  }

  getHallOptions(): Observable<string[]> {
    return this.http.get<ApiFitnessClass[]>(`${this.API}/classes/`).pipe(
      map((classes) => {
        const halls = [...new Set(classes.map((item) => item.hall).filter(Boolean) as string[])];
        return halls.length ? halls : ['Main hall', 'Hall A', 'Hall B'];
      })
    );
  }

  bookClass(classId: number): Observable<void> {
    return this.http.post(`${this.API}/book/`, { fitness_class: classId }).pipe(
      map(() => void 0)
    );
  }

  cancelBooking(classId: number): Observable<void> {
    const bookingId = this.bookingIdByClassId.get(classId);
    if (!bookingId) {
      return throwError(() => new Error('Booking id not found for class.'));
    }
    return this.http.post(`${this.API}/cancel/${bookingId}/`, {}).pipe(map(() => void 0));
  }

  isBooked(classId: number): boolean {
    return this.bookedClassIds.has(classId);
  }

  addClass(newClass: Omit<FitnessClass, 'id' | 'bookedCount'>): Observable<void> {
    return this.http.get<ApiTrainer[]>(`${this.API}/trainers/`).pipe(
      switchMap((trainers) => {
        const trainer = trainers.find(
          (item) => item.name.toLowerCase() === newClass.trainer.trim().toLowerCase()
        );
        if (!trainer) {
          return throwError(() => new Error('Trainer not found. Use exact trainer name from trainers list.'));
        }

        const [hours, minutes] = newClass.time.split(':').map(Number);
        const date = this.getNextDateForDay(newClass.day, hours, minutes);
return this.http.post(`${this.API}/admin/classes/`, {
          title: newClass.title,
          description: newClass.description,
          datetime: date.toISOString(),
          capacity: newClass.capacity,
          direction: newClass.direction,
          hall: newClass.hall,
          trainer: trainer.id
        });
      }),
      map(() => void 0)
    );
  }

  deleteClass(id: number): Observable<void> {
    return this.http.delete(`${this.API}/admin/classes/${id}/`).pipe(map(() => void 0));
  }

  private mapApiClass(item: ApiFitnessClass): FitnessClass {
    const date = new Date(item.datetime);
    const dayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()] as FitnessDayKey;
    const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    const dateLabel = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}`;
    const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return {
      id: item.id,
      title: item.title,
      direction: item.direction as FitnessClass['direction'],
      trainer: item.trainer_name,
      hall: item.hall || 'Main hall',
      day: dayKey,
      dayLabel,
      dateLabel,
      time,
      duration: 50,
      capacity: item.capacity,
      bookedCount: item.booked_count,
      description: item.description
    };
  }

  private getNextDateForDay(day: FitnessDayKey, hours: number, minutes: number): Date {
    const targetDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(day);
    const now = new Date();
    const date = new Date(now);
    const diff = (targetDay - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + diff);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}