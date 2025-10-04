import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CouponSheet } from './sheets/coupon-sheet';
import { CouponRequest, CouponResponse } from './models';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { HttpService } from '../../core/services/http-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ym-shopping',
  template: `
    <div class="container">
      <div class="left">
        <div class="title">
          <span>Coupons</span>
        </div>

        <div class="list">
          @if (couponRef.isLoading()) {
          <h2>Loading...</h2>
          } @else if (couponRef.error()) {
          <h2>ERROR!!!!</h2>
          } @else {
          <!-- -->
          <mat-list>
            @for (coupon of couponRef.value(); track coupon.id) {
            <mat-list-item>
              <mat-icon matListItemIcon svgIcon="coupon">coupon</mat-icon>
              <div matListItemTitle>{{ coupon.name }}</div>
              <div matListItemLine>{{ coupon.expiredAt | date }}</div>
              @if(coupon.website) {
              <div matListItemLine>
                <a [href]="coupon.website" target="_blank" rel="noreferrer">{{
                  coupon.website
                }}</a>
              </div>
              }
            </mat-list-item>
            @if (!$last) {
            <mat-divider></mat-divider>
            }
            <!-- -->
            } @empty {
            <h2>No data...</h2>
            }
            <!-- -->
          </mat-list>
          }
        </div>

        <div class="actions">
          <button matFab (click)="openCouptonSheet()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
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
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatListModule,
  ],
})
export class ShoppingComponent {
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly httpService = inject(HttpService);

  protected couponRef = rxResource({
    stream: () => this.httpService.get<CouponResponse[]>('/coupons'),
    defaultValue: [],
  });

  openCouptonSheet(): void {
    this.bottomSheet
      .open(CouponSheet, { hasBackdrop: true, disableClose: true })
      .afterDismissed()
      .subscribe((result: CouponRequest) => {
        if (!result) {
          return;
        }

        this.httpService
          .create<CouponRequest>('/coupons', result)
          .subscribe(() => {
            this.couponRef.reload();
          });
      });
  }
}
