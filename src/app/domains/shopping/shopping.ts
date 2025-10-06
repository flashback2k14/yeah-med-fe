import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CouponsComponent } from './coupons/coupons';

@Component({
  selector: 'ym-shopping',
  template: `
    <div class="container">
      <div class="left">
        <ym-shopping-coupons />
      </div>

      <div class="right">
        <div class="title">
          <h3>Shopping list</h3>
        </div>

        <div class="list">
          <h1>Coming soon...</h1>
        </div>

        <div class="actions"></div>
      </div>
    </div>
  `,
  styleUrl: './shopping.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CouponsComponent],
})
export class ShoppingComponent {}
