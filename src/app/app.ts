import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-10 border-4 border-dashed border-blue-500 text-center">
      <h1 class="text-3xl font-bold text-gray-800">ToDo list for Embrace - by jgargal</h1>
      <p class="mt-4 text-xl">{{ data() || 'Conectando...' }}</p>
      @if (error()) {
        <p class="text-red-500 mt-2">{{ error() }}</p>
      }
    </div>
  `,
})
export class App implements OnInit {
  // <-- Clase "App"
  data = signal('');
  error = signal('');

  async ngOnInit() {
    try {
      const res = await fetch('https://todolist-jgg.azurewebsites.net/api/helloworld');
      if (!res.ok) throw new Error('Fallo en API');
      const text = await res.text();
      this.data.set(text);
    } catch (e: any) {
      this.error.set(e.message);
    }
  }
}
