import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap, throwError } from 'rxjs';
import { BookingItem, FitnessClass } from '../models/class.model';

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
  created_at: string;
  class_title: string;
  class_direction: string;
  class_datetime: string;
  class_hall: string;
  class_trainer: string;
  class_description: string;
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
      bookings: this.http.get<ApiBooking[]>(`${this.API}/my-bookings/`).pipe(catchError(() => of([])))
    }).pipe(
      map(({ classes, bookings }) => {
        this.syncBookings(bookings);

        const mapped = classes
          .map((item) => this.mapApiClass(item))
          .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
        this.lastLoadedClasses = mapped;
        return mapped;
      })
    );
  }

  getDirections(): string[] {
    return ['All', 'Boxing', 'Yoga', 'Strength', 'Cycling', 'Pilates', 'Dance Fit'];
  }

  getDirectionOptions(): string[] {
    return ['Boxing', 'Yoga', 'Strength', 'Cycling', 'Pilates', 'Dance Fit'];
  }

  getTrainers(): string[] {
    const trainers = [...new Set(this.lastLoadedClasses.map((item) => item.trainer))];
    return ['All', ...trainers];
  }

  getTrainerNames(): Observable<string[]> {
    return this.http.get<ApiTrainer[]>(`${this.API}/trainers/`).pipe(
      map((trainers) => trainers.map((trainer) => trainer.name))
    );
  }

  getMyBookings(): Observable<BookingItem[]> {
    return this.http.get<ApiBooking[]>(`${this.API}/my-bookings/`).pipe(
      map((bookings) => {
        this.syncBookings(bookings);
        return bookings
          .map((booking) => ({
            id: booking.id,
            fitnessClassId: booking.fitness_class,
            status: booking.status,
            createdAt: booking.created_at,
            classTitle: booking.class_title,
            classDirection: booking.class_direction,
            classDatetime: booking.class_datetime,
            classHall: booking.class_hall || '—',
            classTrainer: booking.class_trainer || '—',
            classDescription: booking.class_description || ''
          }))
          .sort((a, b) => new Date(a.classDatetime).getTime() - new Date(b.classDatetime).getTime());
      })
    );
  }

  bookClass(classId: number): Observable<void> {
    return this.http.post<ApiBooking>(`${this.API}/book/`, { fitness_class: classId }).pipe(
      map((booking) => {
        if (booking?.status === 'booked') {
          this.bookingIdByClassId.set(booking.fitness_class, booking.id);
          this.bookedClassIds.add(booking.fitness_class);
          this.updateLocalBookedCount(booking.fitness_class, 1);
        }
        return void 0;
      })
    );
  }

  cancelBooking(classId: number): Observable<void> {
    const bookingId = this.bookingIdByClassId.get(classId);
    if (!bookingId) {
      return throwError(() => new Error('Booking id not found for class.'));
    }

    return this.http.post(`${this.API}/cancel/${bookingId}/`, {}).pipe(
      map(() => {
        this.bookingIdByClassId.delete(classId);
        this.bookedClassIds.delete(classId);
        this.updateLocalBookedCount(classId, -1);
        return void 0;
      })
    );
  }

  isBooked(classId: number): boolean {
    return this.bookedClassIds.has(classId);
  }

  addClass(newClass: Omit<FitnessClass, 'id' | 'bookedCount' | 'datetime' | 'dateKey'> & { date: string }): Observable<FitnessClass> {
    return this.http.get<ApiTrainer[]>(`${this.API}/trainers/`).pipe(
      switchMap((trainers) => {
        const trainer = trainers.find(
          (item) => item.name.toLowerCase() === newClass.trainer.trim().toLowerCase()
        );

        if (!trainer) {
          return throwError(() => new Error('Trainer not found. Use exact trainer name from trainers list.'));
        }

        const datetime = this.combineDateAndTime(newClass.date, newClass.time);

        return this.http.post<ApiFitnessClass>(`${this.API}/admin/classes/`, {
          title: newClass.title,
          description: newClass.description,
          datetime,
          capacity: newClass.capacity,
          direction: newClass.direction,
          hall: newClass.hall.trim(),
          trainer: trainer.id
        });
      }),
      map((createdClass) => {
        const mappedClass = this.mapApiClass(createdClass);
        this.lastLoadedClasses = [...this.lastLoadedClasses, mappedClass].sort(
          (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        );
        return mappedClass;
      })
    );
  }

  deleteClass(id: number): Observable<void> {
    return this.http.delete(`${this.API}/admin/classes/${id}/`).pipe(
      map(() => {
        this.lastLoadedClasses = this.lastLoadedClasses.filter((item) => item.id !== id);
        return void 0;
      })
    );
  }

  mapApiClass(item: ApiFitnessClass): FitnessClass {
    const rawDate = new Date(item.datetime);
    const localDate = new Date(rawDate);
    const dayIndex = localDate.getDay();
    const day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dayIndex] as FitnessClass['day'];
    const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
    const dateKey = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
    const dateLabel = localDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const time = localDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return {
      id: item.id,
      title: item.title,
      direction: item.direction as FitnessClass['direction'],
      trainer: item.trainer_name,
      hall: item.hall || 'Main hall',
      day,
      dayLabel,
      dateLabel,
      dateKey,
      datetime: item.datetime,
      time,
      duration: 50,
      capacity: item.capacity,
      bookedCount: item.booked_count,
      description: item.description
    };
  }

  private combineDateAndTime(date: string, time: string): string {
    const safeDate = date || new Date().toISOString().split('T')[0];
    const safeTime = time || '07:00';
    return `${safeDate}T${safeTime}:00`;
  }

  private syncBookings(bookings: ApiBooking[]): void {
    this.bookingIdByClassId.clear();
    this.bookedClassIds.clear();
    bookings
      .filter((booking) => booking.status === 'booked')
      .forEach((booking) => {
        this.bookingIdByClassId.set(booking.fitness_class, booking.id);
        this.bookedClassIds.add(booking.fitness_class);
      });
  }

  private updateLocalBookedCount(classId: number, diff: number): void {
    this.lastLoadedClasses = this.lastLoadedClasses.map((item) => {
      if (item.id !== classId) {
        return item;
      }

      return {
        ...item,
        bookedCount: Math.max(0, item.bookedCount + diff)
      };
    });
  }
}
