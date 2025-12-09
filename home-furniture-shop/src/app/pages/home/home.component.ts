import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  title: string;
  category: string;
  color: string; // background color for design
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], // <-- Required for *ngFor and *ngIf
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  slides: Slide[] = [
    { title: 'Modern Sofa', category: 'Furniture', color: '#FFB74D' },
    { title: 'Elegant Vase', category: 'Decor', color: '#81C784' },
    { title: 'Bed Sheets', category: 'Essentials', color: '#64B5F6' },
    { title: 'Wooden Chair', category: 'Furniture', color: '#FF8A65' },
    { title: 'Wall Art', category: 'Decor', color: '#4DB6AC' },
    { title: 'Cooking Set', category: 'Essentials', color: '#7986CB' }
  ];

  currentSlide: number = 0;
  sliderInterval: any;

  constructor() {
    this.startSlider();
  }

  startSlider(): void {
    this.sliderInterval = setInterval(() => this.nextSlide(), 4000);
  }

  pauseSlider(): void {
    clearInterval(this.sliderInterval);
  }

  resumeSlider(): void {
    this.startSlider();
  }

  prevSlide(): void {
    this.currentSlide =
      this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  nextSlide(): void {
    this.currentSlide =
      this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
  }
}
