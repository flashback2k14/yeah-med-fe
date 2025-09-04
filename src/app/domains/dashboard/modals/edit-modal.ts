import { Component, inject, signal } from '@angular/core';
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
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete';

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
              [(ngModel)]="deps.selectedRow.name"
              autofocus
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
              [(ngModel)]="deps.selectedRow.expiredAt"
            />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <ym-autocomplete
            class="half"
            [all]="deps.categories"
            [(selectedEntries)]="selectedCategories"
            labelKey="dashboard.add-modal.category.label"
            placeholderKey="dashboard.add-modal.category.placeholder"
          />

          <ym-autocomplete
            class="half spacer"
            [all]="deps.locations"
            [(selectedEntries)]="selectedLocations"
            labelKey="dashboard.add-modal.location.label"
            placeholderKey="dashboard.add-modal.location.placeholder"
          />

          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('description.label') }}</mat-label>
            <textarea
              matInput
              name="description"
              [placeholder]="t('description.placeholder')"
              [(ngModel)]="deps.selectedRow.description"
            ></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('productId.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('productId.placeholder')"
              name="productId"
              [(ngModel)]="deps.selectedRow.productId"
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
    AutocompleteComponent,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslocoDirective,
  ],
})
export class EditModal {
  protected readonly dialogRef = inject(MatDialogRef<EditModal>);
  protected readonly deps = inject<{
    selectedRow: TableRow;
    categories: string[];
    locations: string[];
  }>(MAT_DIALOG_DATA);

  protected selectedCategories = signal<string[]>(
    this.deps.selectedRow.category.split(',')
  );

  protected selectedLocations = signal<string[]>(
    this.deps.selectedRow.location.split(',')
  );

  onSubmit(f: NgForm) {
    if (
      this.selectedCategories().length === 0 ||
      this.selectedLocations().length === 0
    ) {
      return;
    }

    // TODO: change Backend to handle multi categories and locations
    if (f.valid) {
      this.dialogRef.close({
        ...f.value,
        category: this.selectedCategories().join(','),
        location: this.selectedLocations().join(','),
      });
    }
  }
}
