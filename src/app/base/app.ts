import {
  Component,
  inject,
  OnInit,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../core/auth-service';
import { NotifyService } from '../notify/notify-service';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, TranslocoDirective],
})
export class App implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly notifyService = inject(NotifyService);
  private vcr = viewChild('notify', { read: ViewContainerRef });

  ngOnInit(): void {
    initFlowbite();
    this.notifyService.init(this.vcr);
  }
}
