import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { HttpService } from '../../core/services/http-service';
import { IsExpiredPipe } from '../dashboard/pipes/table-pipes';
import { CouponRequest, CouponResponse } from './models';
import { CouponSheet } from './sheets/coupon-sheet';

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
            <mat-list-item [class.expired]="coupon.expiredAt | isExpired">
              <mat-icon matListItemIcon svgIcon="coupon">coupon</mat-icon>
              <div matListItemMeta>
                <mat-icon (click)="handleEdit(coupon)">edit</mat-icon>
                <mat-icon (click)="handleDelete(coupon)">delete</mat-icon>
              </div>
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
    IsExpiredPipe,
    MatBottomSheetModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
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

  handleDelete(coupon: CouponResponse) {
    const confirmed = confirm(
      'Are you sure to delete the coupon: ' + coupon.name + '?'
    );

    if (confirmed) {
      this.httpService
        .delete('/coupons/' + coupon.id)
        .subscribe(() => this.couponRef.reload());
    }
  }

  handleEdit(coupon: CouponResponse) {
    this.bottomSheet
      .open(CouponSheet, {
        data: JSON.parse(JSON.stringify(coupon)),
        hasBackdrop: true,
        disableClose: true,
      })
      .afterDismissed()
      .subscribe((result: CouponRequest) => {
        if (!result) {
          return;
        }

        const data = {
          ...coupon,
          ...result,
        };

        this.httpService
          .update<CouponResponse>(`/coupons/${coupon.id}`, data)
          .subscribe(() => this.couponRef.reload());
      });
  }

  openCouptonSheet(): void {
    this.bottomSheet
      .open(CouponSheet, { data: {}, hasBackdrop: true, disableClose: true })
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
