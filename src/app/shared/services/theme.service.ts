import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  
  // Signal to hold current theme state
  theme = signal<Theme>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initTheme();
    }
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private setTheme(theme: Theme) {
    this.theme.set(theme);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}
