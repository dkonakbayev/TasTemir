import { Component } from '@angular/core';

export interface Direction {
  icon: string;
  title: string;
  description: string;
  longDescription: string;
  schedule: string[];
  level: string;
  duration: string;
  trainer: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  selectedDirection: Direction | null = null;

  directions: Direction[] = [
    {
      icon: '🥊',
      title: 'Boxing',
      description: 'High-intensity boxing classes for all levels.',
      longDescription: 'Our boxing program combines technical drills, bag work, and sparring sessions. You will improve your footwork, hand speed, and defensive techniques while burning up to 800 calories per session. Suitable for complete beginners and experienced fighters alike.',
      schedule: ['Mon 07:00', 'Wed 09:00', 'Fri 07:00', 'Sat 10:00'],
      level: 'All levels',
      duration: '90 min',
      trainer: 'Aibek Dzhaksybekov'
    },
    {
      icon: '🧘',
      title: 'Yoga',
      description: 'Restore balance and flexibility with expert-led sessions.',
      longDescription: 'A blend of Hatha and Vinyasa yoga designed to improve flexibility, mental clarity, and body awareness. Each class begins with breathwork and ends with a guided relaxation. Regular practice reduces stress and improves posture significantly.',
      schedule: ['Tue 08:00', 'Thu 08:00', 'Sat 09:00', 'Sun 10:00'],
      level: 'Beginner friendly',
      duration: '75 min',
      trainer: 'Salima Nurova'
    },
    {
      icon: '🏋️',
      title: 'Strength',
      description: 'Progressive weight training tailored to your goals.',
      longDescription: 'Science-backed progressive overload programming. Whether your goal is muscle gain, fat loss, or athletic performance, our coaches design personalized programs. Small groups ensure proper form correction and maximum results.',
      schedule: ['Mon 09:00', 'Tue 18:00', 'Thu 18:00', 'Sat 11:00'],
      level: 'Intermediate',
      duration: '90 min',
      trainer: 'Dmitry Voronov'
    },
    {
      icon: '🚴',
      title: 'Cycling',
      description: 'Indoor cycling workouts that torch calories.',
      longDescription: 'High-energy indoor cycling sessions with motivating music and interval training. Our bikes have performance monitors so you can track output, cadence, and resistance. Great for cardiovascular health and leg strength.',
      schedule: ['Mon 18:00', 'Wed 07:00', 'Fri 18:00', 'Sun 09:00'],
      level: 'All levels',
      duration: '45 min',
      trainer: 'Madina Bekova'
    },
    {
      icon: '🤸',
      title: 'Pilates',
      description: 'Core-focused classes to improve posture and stability.',
      longDescription: 'Mat and reformer Pilates focusing on deep core activation, spinal alignment, and controlled movement. Excellent for rehabilitation, injury prevention, and building functional strength. Often recommended by physiotherapists.',
      schedule: ['Tue 10:00', 'Thu 10:00', 'Fri 09:00', 'Sun 11:00'],
      level: 'All levels',
      duration: '60 min',
      trainer: 'Zarina Seitova'
    },
    {
      icon: '💃',
      title: 'Dance Fit',
      description: 'Energetic dance workouts blending cardio and coordination.',
      longDescription: 'Choreography-based fitness inspired by Latin, hip-hop, and contemporary dance styles. No dance experience needed — just bring your energy. Each class burns 400–600 calories while improving rhythm, coordination, and mood.',
      schedule: ['Wed 18:00', 'Fri 19:00', 'Sat 12:00', 'Sun 12:00'],
      level: 'All levels',
      duration: '55 min',
      trainer: 'Madina Bekova'
    },
  ];

  openModal(dir: Direction) {
    this.selectedDirection = dir;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedDirection = null;
    document.body.style.overflow = '';
  }
}