import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';
import { CouponRequest, CouponResponse } from '../models';
import { Field, form, required, submit } from '@angular/forms/signals';

@Component({
  selector: 'ym-shopping-coupon-sheet',
  template: `
    <ng-container *transloco="let t; prefix: 'shopping.coupon'">
      <form>
        <div class="container">
          <!-- NAME -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('name.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('name.placeholder')"
              required=""
              [field]="dataForm.name"
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
              (dateChange)="onDateChanged($event)"
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
              [field]="dataForm.website"
            />
          </mat-form-field>

          <!-- NOTES -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('notes.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('notes.placeholder')"
              [field]="dataForm.notes"
            />
          </mat-form-field>

          <div class="actions">
            <button matButton (click)="close()">
              {{ t('actions.close') }}
            </button>
            <button
              matButton
              [disabled]="!dataForm().valid()"
              (click)="onSubmit()"
            >
              {{ t('actions.save') }}
            </button>
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
    Field,
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

  protected dataModel = signal<CouponResponse>(this.data);
  protected dataForm = form(this.dataModel, (path) => {
    required(path.name);
    required(path.expiredAt);
  });

  onDateChanged(evt: MatDatepickerInputEvent<Date>): void {
    // FIXME: angular material datepicker can't handle signal forms at the moment: 13102025
    this.dataForm.expiredAt().value.set(evt.value ?? new Date(Date.now()));
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  onSubmit(): void {
    submit(this.dataForm, async (form) => {
      this.bottomSheetRef.dismiss({
        ...form().value(),
      });
      return null;
    });
  }
}
