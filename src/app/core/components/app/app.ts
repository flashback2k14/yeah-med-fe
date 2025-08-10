import {
  Component,
  inject,
  OnInit,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NotifyService } from '../../services/notify-service';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';
import { MainComponent } from '../main/main';

@Component({
  selector: 'ym-root',
  template: `
    <div class="container">
      <ym-header />

      <ym-main>
        <router-outlet />
      </ym-main>

      <ym-footer />

      <ng-container #notify></ng-container>
    </div>
  `,
  styleUrl: './app.scss',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MainComponent],
})
export class App implements OnInit {
  private readonly notifyService = inject(NotifyService);

  private vcr = viewChild('notify', { read: ViewContainerRef });

  ngOnInit(): void {
    this.notifyService.init(this.vcr);
  }
}
