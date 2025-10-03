import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
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

import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete';

@Component({
  selector: 'ym-add-modal',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard.add-modal'">
      <form #f="ngForm" (ngSubmit)="onSubmit(f)">
        <h2 mat-dialog-title>{{ t('title') }}</h2>
        
        <mat-dialog-content class="mat-typography">
          <!-- NAME -->
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

          <!-- EXPIRED AT -->
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
            <mat-datepicker #picker startView="multi-year"></mat-datepicker>
          </mat-form-field>

          <!-- CATEGORY -->
          <ym-autocomplete
            class="half"
            [all]="deps.categories"
            [(selectedEntries)]="selectedCategories"
            labelKey="dashboard.add-modal.category.label"
            placeholderKey="dashboard.add-modal.category.placeholder"
          />

          <!-- LOCATION -->
          <ym-autocomplete
            class="half spacer"
            [all]="deps.locations"
            [(selectedEntries)]="selectedLocations"
            labelKey="dashboard.add-modal.location.label"
            placeholderKey="dashboard.add-modal.location.placeholder"
          />

          <!-- DESCRIPTION -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('description.label') }}</mat-label>
            <textarea
              matInput
              name="description"
              [placeholder]="t('description.placeholder')"
              ngModel
            ></textarea>
          </mat-form-field>

          <!-- PRODUCT ID -->
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
          <div class="actions">
            <span>{{ t('actions.required') }}</span>
            <div>
              <button matButton [mat-dialog-close]>
                {{ t('actions.close') }}
              </button>
              <button type="submit" matButton>
                {{ t('actions.save') }}
              </button>
            </div>
          </div>
        </mat-dialog-actions>
      </form>
    </ng-container>
  `,
  styleUrl: './modals.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TranslocoDirective,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    AutocompleteComponent,
  ],
})
export class AddModal {
  protected readonly dialogRef = inject(MatDialogRef<AddModal>);
  protected readonly deps = inject<{
    categories: string[];
    locations: string[];
  }>(MAT_DIALOG_DATA);

  protected selectedCategories = signal<string[]>([]);
  protected selectedLocations = signal<string[]>([]);

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
