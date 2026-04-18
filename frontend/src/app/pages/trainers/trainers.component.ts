import { Component } from '@angular/core';

export interface Trainer {
  name: string;
  initials: string;
  specialization: string;
  directions: string[];
  experience: string;
  bio: string;
  fullBio: string;
  certifications: string[];
  schedule: string[];
  achievements: string[];
}

@Component({
  selector: 'app-trainers',
  standalone: true,
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css'
})
export class TrainersComponent {
  selectedTrainer: Trainer | null = null;

  trainers: Trainer[] = [
    {
      name: 'Aibek Dzhaksybekov',
      initials: 'AD',
      specialization: 'Head Boxing Coach',
      directions: ['Boxing', 'Strength'],
      experience: '10 years',
      bio: 'Former national champion. Specializes in technique and footwork for all skill levels.',
      fullBio: 'Aibek is a former national boxing champion who competed professionally for 8 years before transitioning to coaching. His training methodology blends traditional boxing fundamentals with modern sports science. He has coached over 200 athletes ranging from complete beginners to national-level competitors.',
      certifications: ['AIBA Level 3 Coach', 'Sports Nutrition Certificate', 'First Aid & CPR'],
      schedule: ['Mon 07:00', 'Wed 07:00', 'Fri 07:00', 'Sat 10:00'],
      achievements: ['National Champion 2012', 'Trained 3 national-team athletes', 'Coach of the Year 2021']
    },
    {
      name: 'Salima Nurova',
      initials: 'SN',
      specialization: 'Yoga & Pilates',
      directions: ['Yoga', 'Pilates'],
      experience: '7 years',
      bio: 'Certified in Hatha and Vinyasa yoga. Passionate about mindful movement and recovery.',
      fullBio: 'Salima discovered yoga during her recovery from a sports injury and was so transformed by the practice that she became a full-time instructor. She is certified in both Hatha and Vinyasa styles and brings a deeply personal, therapeutic approach to every class. She also integrates breathwork and meditation into her sessions.',
      certifications: ['RYT-500 Yoga Alliance', 'Pilates Mat Certification', 'Trauma-Informed Yoga'],
      schedule: ['Tue 08:00', 'Thu 08:00', 'Sat 09:00', 'Sun 10:00'],
      achievements: ['500+ hours of teaching', 'Retreat facilitator in Bali (2022)', '200 active regular students']
    },
    {
      name: 'Dmitry Voronov',
      initials: 'DV',
      specialization: 'Strength & Conditioning',
      directions: ['Strength', 'Cycling'],
      experience: '8 years',
      bio: 'Sports science graduate. Designs progressive programs for athletes and beginners alike.',
      fullBio: 'Dmitry holds a degree in Sports Science from Kazakh National University. He specializes in evidence-based strength training, periodization, and body composition. His programs are meticulously structured and adapted to each client\'s physiology, goals, and schedule.',
      certifications: ['CSCS – NSCA', 'BSc Sports Science', 'PN Level 1 Nutrition'],
      schedule: ['Mon 09:00', 'Tue 18:00', 'Thu 18:00', 'Sat 11:00'],
      achievements: ['Helped 50+ clients lose 10kg+', 'Published in KZ Sports Journal', 'Former competitive powerlifter']
    },
    {
      name: 'Madina Bekova',
      initials: 'MB',
      specialization: 'Dance Fitness',
      directions: ['Dance Fit', 'Cycling'],
      experience: '5 years',
      bio: 'Choreographer turned fitness coach. Makes every session feel like a celebration.',
      fullBio: 'Madina trained as a professional dancer for 10 years before pivoting to fitness instruction. She brings her choreography background into every class, creating routines that are not only effective but genuinely fun. Her Dance Fit classes are consistently the most attended sessions at FitBook.',
      certifications: ['Zumba Licensed Instructor', 'Indoor Cycling Certified', 'Group Fitness Instructor'],
      schedule: ['Wed 18:00', 'Fri 19:00', 'Sat 12:00', 'Sun 12:00'],
      achievements: ['1,000+ classes taught', 'Featured in FitMag KZ', 'Community Favorite Award 2023']
    },
    {
      name: 'Ruslan Akhmetov',
      initials: 'RA',
      specialization: 'CrossFit & Boxing',
      directions: ['Boxing', 'Strength'],
      experience: '6 years',
      bio: 'CrossFit Level 2 trainer with a background in combat sports. High energy, high results.',
      fullBio: 'Ruslan brings the intensity of CrossFit and the discipline of combat sports into a unique hybrid training style. Every session with Ruslan pushes you to your limits in a supportive, motivating environment. He specializes in functional fitness and athletic conditioning for people who want serious results.',
      certifications: ['CrossFit Level 2 Trainer', 'MMA Conditioning Specialist', 'First Aid & CPR'],
      schedule: ['Tue 07:00', 'Thu 07:00', 'Sat 08:00', 'Sun 09:00'],
      achievements: ['CrossFit Regional competitor 2019', 'Trained amateur MMA fighters', '98% client retention rate']
    },
    {
      name: 'Zarina Seitova',
      initials: 'ZS',
      specialization: 'Pilates & Yoga',
      directions: ['Pilates', 'Yoga'],
      experience: '4 years',
      bio: 'Focuses on rehabilitation and body awareness. Perfect for those recovering from injury.',
      fullBio: 'Zarina works closely with physiotherapists to design classes that support injury recovery, chronic pain management, and postural correction. Her approach is gentle, precise, and deeply educational — clients leave each session understanding their body better. She is particularly popular among clients aged 40+.',
      certifications: ['Balanced Body Pilates', 'Yoga for Rehabilitation', 'Functional Anatomy Course'],
      schedule: ['Tue 10:00', 'Thu 10:00', 'Fri 09:00', 'Sun 11:00'],
      achievements: ['Specialist in post-surgery rehab', 'Partners with 3 local clinics', '100% satisfaction in surveys']
    },
  ];

  openModal(trainer: Trainer) {
    this.selectedTrainer = trainer;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedTrainer = null;
    document.body.style.overflow = '';
  }
}