import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
    <section class="bg-gray-50 dark:bg-gray-900">
      <div
        class="flex flex-col items-center justify-start px-6 py-8 mx-auto lg:py-0 h-app-screen overflow-auto"
      >
        <ng-content></ng-content>
      </div>
    </section>
  `,
})
export class MainComponent {}
