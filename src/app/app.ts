import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class App implements OnInit {
  // <-- Clase "App"
  data = signal('');
  error = signal('');

  async ngOnInit() {
    try {
      const res = await fetch('http://localhost:5124/api/helloworld');
      if (!res.ok) throw new Error('Fallo en API');
      const text = await res.text();
      this.data.set(text);
    } catch (e: any) {
      this.error.set(e.message);
    }
  }
}
