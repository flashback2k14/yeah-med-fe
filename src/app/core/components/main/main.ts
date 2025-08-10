import { Component } from '@angular/core';

@Component({
  selector: 'ym-main',
  template: `
    <main class="container">
      <ng-content></ng-content>
    </main>
  `,
  styleUrl: './main.scss',
})
export class MainComponent {}
