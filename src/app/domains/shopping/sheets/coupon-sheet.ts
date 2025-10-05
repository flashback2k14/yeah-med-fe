import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';
import { CouponRequest, CouponResponse } from '../models';

@Component({
  selector: 'ym-shopping-coupon-sheet',
  template: `
    <ng-container *transloco="let t; prefix: 'shopping.coupon'">
      <form #f="ngForm" (ngSubmit)="onSubmit(f)">
        <div class="container">
          <!-- NAME -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('name.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('name.placeholder')"
              required=""
              name="name"
              [(ngModel)]="data.name"
              autofocus
            />
          </mat-form-field>

          <!-- EXPIRED AT -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('expiredAt.label') }}</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              [placeholder]="t('expiredAt.placeholder')"
              required=""
              name="expiredAt"
              [(ngModel)]="data.expiredAt"
            />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <!-- WEBSITE -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('website.label') }}</mat-label>
            <input
              matInput
              type="url"
              [placeholder]="t('website.placeholder')"
              name="website"
              [(ngModel)]="data.website"
            />
          </mat-form-field>

          <div class="actions">
            <button matButton (click)="close()">
              {{ t('actions.close') }}
            </button>
            <button type="submit" matButton>{{ t('actions.save') }}</button>
          </div>
        </div>
      </form>
    </ng-container>
  `,
  styles: `
    .container {
      padding: 1rem;

      .full {
        width: 100%;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslocoDirective,
  ],
})
export class CouponSheet {
  private bottomSheetRef =
    inject<MatBottomSheetRef<CouponSheet, CouponRequest>>(MatBottomSheetRef);
  protected readonly data = inject<CouponResponse>(MAT_BOTTOM_SHEET_DATA);

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  onSubmit(f: NgForm): void {
    if (f.valid) {
      this.bottomSheetRef.dismiss({
        ...f.value,
      } as CouponRequest);
    }
  }
}
