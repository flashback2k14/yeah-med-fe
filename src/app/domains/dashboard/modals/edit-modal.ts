import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';
import { TableRow } from '../models';

@Component({
  selector: 'ym-edit-modal',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard.edit-modal'">
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
              [(ngModel)]="selectedRow.name"
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
              [(ngModel)]="selectedRow.location"
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
              [(ngModel)]="selectedRow.category"
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
              [(ngModel)]="selectedRow.expiredAt"
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
              [(ngModel)]="selectedRow.description"
            ></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('productId.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('productId.placeholder')"
              name="productId"
              [(ngModel)]="selectedRow.productId"
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
export class EditModal {
  private readonly dialogRef = inject(MatDialogRef<EditModal>);
  selectedRow = inject<TableRow>(MAT_DIALOG_DATA);

  onSubmit(f: NgForm) {
    if (f.valid) {
      this.dialogRef.close(f.value);
    }
  }
}
