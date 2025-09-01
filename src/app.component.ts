import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Option {
  label: string;
  value: number;
}

interface FieldOption extends Option {
  key: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AppComponent {
  // --- State Signals ---
  projectType = signal<'thesis' | 'proposal'>('thesis');
  academicLevel = signal<'master' | 'phd'>('master');
  selectedFieldKey = signal<string>('');
  workTypeMultiplier = signal<number>(0);
  universityMultiplier = signal<number>(0);
  timeMultiplier = signal<number>(0);

  // --- Data Options ---
  masterFields: FieldOption[] = [
    { key: 'humanities', label: 'علوم انسانی و مدیریت', value: 12_000_000 },
    { key: 'engineering', label: 'فنی–مهندسی و علوم پایه', value: 18_000_000 },
    { key: 'medical', label: 'علوم پزشکی و تجربی', value: 20_000_000 },
  ];

  phdFields: FieldOption[] = [
    { key: 'humanities', label: 'علوم انسانی و مدیریت', value: 30_000_000 },
    { key: 'engineering', label: 'فنی–مهندسی و علوم پزشکی', value: 40_000_000 },
  ];

  workTypes: Option[] = [
    { label: 'علوم انسانی / مدیریت ساده', value: 1 },
    { label: 'علوم انسانی با مدل مفهومی و آماری', value: 1.2 },
    { label: 'حسابداری و مالی با مدل ریاضی یا نرم‌افزاری', value: 1.3 },
    { label: 'فنی–مهندسی تئوری', value: 1.2 },
    { label: 'فنی–مهندسی با شبیه‌سازی نرم‌افزاری', value: 1.5 },
    { label: 'علوم پزشکی (کار میدانی ساده)', value: 1.3 },
    { label: 'علوم پزشکی (آزمایشگاهی/مدل‌سازی پیچیده)', value: 1.7 },
  ];

  universityTypes: Option[] = [
    { label: 'پیام نور / علمی‌کاربردی', value: 0.9 },
    { label: 'آزاد', value: 1 },
    { label: 'سراسری (رتبه‌های برتر)', value: 1.2 },
  ];

  deliveryTimes: Option[] = [
    { label: 'عادی (۳ تا ۶ ماه)', value: 1 },
    { label: 'فشرده (۱ تا ۳ ماه)', value: 1.3 },
    { label: 'فوری (زیر ۱ ماه)', value: 1.5 },
  ];

  // --- Computed Signals for Calculation ---
  currentFields = computed(() => {
    return this.academicLevel() === 'master' ? this.masterFields : this.phdFields;
  });

  basePrice = computed(() => {
    const fields = this.academicLevel() === 'master' ? this.masterFields : this.phdFields;
    const selectedField = fields.find(f => f.key === this.selectedFieldKey());
    return selectedField ? selectedField.value : 0;
  });
  
  projectTypeMultiplier = computed(() => {
    return this.projectType() === 'proposal' ? 0.3 : 1;
  });

  finalPrice = computed(() => {
    const base = this.basePrice();
    const work = this.workTypeMultiplier();
    const uni = this.universityMultiplier();
    const time = this.timeMultiplier();
    const projectType = this.projectTypeMultiplier();

    if (base === 0 || work === 0 || uni === 0 || time === 0) {
      return 0;
    }

    const thesisPrice = base * work * uni * time;
    return thesisPrice * projectType;
  });

  // --- Event Handlers ---
  setProjectType(type: 'thesis' | 'proposal') {
    this.projectType.set(type);
  }

  setAcademicLevel(level: 'master' | 'phd') {
    this.academicLevel.set(level);
    this.selectedFieldKey.set(''); // Reset field selection when level changes
  }

  onFieldChange(event: Event) {
    this.selectedFieldKey.set((event.target as HTMLSelectElement).value);
  }

  onWorkTypeChange(event: Event) {
    this.workTypeMultiplier.set(Number((event.target as HTMLSelectElement).value));
  }

  onUniversityTypeChange(event: Event) {
    this.universityMultiplier.set(Number((event.target as HTMLSelectElement).value));
  }
  
  onDeliveryTimeChange(event: Event) {
    this.timeMultiplier.set(Number((event.target as HTMLSelectElement).value));
  }

  resetForm() {
    this.projectType.set('thesis');
    this.academicLevel.set('master');
    this.selectedFieldKey.set('');
    this.workTypeMultiplier.set(0);
    this.universityMultiplier.set(0);
    this.timeMultiplier.set(0);
  }
}