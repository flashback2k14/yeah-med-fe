import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CouponsComponent } from './coupons/coupons';
import { ShoppingListComponent } from './shopping-list/shopping-list';

@Component({
  selector: 'ym-shopping',
  template: `
    <div class="container">
      <div class="left">
        <ym-shopping-coupons />
      </div>

      <div class="right">
        <ym-shopping-list />
      </div>
    </div>
  `,
  styleUrl: './shopping.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CouponsComponent, ShoppingListComponent],
})
export class ShoppingComponent {}
