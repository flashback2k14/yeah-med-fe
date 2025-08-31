import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'ym-add-modal',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard.add-modal'">
      <form #f="ngForm" (ngSubmit)="onSubmit(f)">
        <h2 mat-dialog-title>{{ t('title') }}</h2>
        <mat-dialog-content class="mat-typography">
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('name.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('name.placeholder')"
              required=""
              name="name"
              ngModel
              autofocus
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="half">
            <mat-label>{{ t('location.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('location.placeholder')"
              required=""
              name="location"
              ngModel
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="half spacer">
            <mat-label>{{ t('category.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('category.placeholder')"
              required=""
              name="category"
              ngModel
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('expiredAt.label') }}</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              [placeholder]="t('expiredAt.placeholder')"
              required=""
              name="expiredAt"
              ngModel
            />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('description.label') }}</mat-label>
            <textarea
              matInput
              name="description"
              [placeholder]="t('description.placeholder')"
              ngModel
            ></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('productId.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('productId.placeholder')"
              name="productId"
              ngModel
            />
          </mat-form-field>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
          <button matButton [mat-dialog-close]>{{ t('actions.close') }}</button>
          <button type="submit" matButton cdkFocusInitial>
            {{ t('actions.save') }}
          </button>
        </mat-dialog-actions>
      </form>
    </ng-container>
  `,
  styles: `
    mat-dialog-content {
      padding-top: 1rem !important;
      --mat-dialog-with-actions-content-padding: 1rem;
    }

    .half {
      width: 49%;
    }

    .spacer {
      margin-left: 8px;
    }

    .full {
      width: 100%
    }
  `,
  imports: [
    FormsModule,
    TranslocoDirective,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
})
export class AddModal {
  private readonly dialogRef = inject(MatDialogRef<AddModal>);

  onSubmit(f: NgForm) {
    if (f.valid) {
      this.dialogRef.close(f.value);
    }
  }
}
