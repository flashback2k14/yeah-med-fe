import {
  Component,
  inject,
  OnInit,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

import { NotifyService } from '../services/notify-service';
import { HeaderComponent } from './header';
import { FooterComponent } from './footer';
import { MainComponent } from './main';

@Component({
  selector: 'app-root',
  template: `
    <app-header />

    <app-main>
      <router-outlet />
    </app-main>

    <app-footer />

    <ng-container #notify></ng-container>
  `,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MainComponent],
})
export class App implements OnInit {
  private readonly notifyService = inject(NotifyService);

  private vcr = viewChild('notify', { read: ViewContainerRef });

  ngOnInit(): void {
    initFlowbite();
    this.notifyService.init(this.vcr);
  }
}
