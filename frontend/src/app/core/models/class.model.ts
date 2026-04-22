export type FitnessDirection = 'Boxing' | 'Yoga' | 'Strength' | 'Cycling' | 'Pilates' | 'Dance Fit';
export type FitnessDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface FitnessClass {
  id: number;
  title: string;
  direction: FitnessDirection;
  trainer: string;
  hall: string;
  day: FitnessDayKey;
  dayLabel: string;
  dateLabel: string;
  dateKey: string;
  datetime: string;
  time: string;
  duration: number;
  capacity: number;
  bookedCount: number;
  description: string;
}

export interface BookingItem {
  id: number;
  fitnessClassId: number;
  status: 'booked' | 'cancelled';
  createdAt: string;
  classTitle: string;
  classDirection: string;
  classDatetime: string;
  classHall: string;
  classTrainer: string;
  classDescription: string;
}
