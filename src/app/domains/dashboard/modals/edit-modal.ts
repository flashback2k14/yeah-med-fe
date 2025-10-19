import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';
import { MedFormData, TableRow, TableRowRequest } from '../models';
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete';
import { Field, form, required, submit } from '@angular/forms/signals';

@Component({
  selector: 'ym-edit-modal',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard.edit-modal'">
      <form>
        <h2 mat-dialog-title>{{ t('title') }}</h2>
        <mat-dialog-content class="mat-typography">
          <!-- NAME -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('name.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('name.placeholder')"
              [field]="dataForm.name"
              required=""
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

          <!-- CATEGORY -->
          <ym-autocomplete
            class="half"
            [all]="data.selectableCategories"
            [field]="dataForm.selectedCategories"
            labelKey="dashboard.add-modal.category.label"
            placeholderKey="dashboard.add-modal.category.placeholder"
          />

          <!-- LOCATION -->
          <ym-autocomplete
            class="half spacer"
            [all]="data.selectableLocations"
            [field]="dataForm.selectedLocations"
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
              [field]="dataForm.description"
            ></textarea>
          </mat-form-field>

          <!-- PRODUCT ID -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('productId.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('productId.placeholder')"
              [field]="dataForm.productId"
            />
          </mat-form-field>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
          <button matButton [mat-dialog-close]>
            {{ t('actions.close') }}
          </button>
          <button
            matButton
            cdkFocusInitial
            [disabled]="!dataForm().valid()"
            (click)="onSubmit()"
          >
            {{ t('actions.save') }}
          </button>
        </mat-dialog-actions>
      </form>
    </ng-container>
  `,
  styleUrl: './modals.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AutocompleteComponent,
    Field,
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
  protected readonly data = inject<MedFormData>(MAT_DIALOG_DATA);

  protected dataModel = signal<MedFormData>(this.data);
  protected dataForm = form(this.dataModel, (path) => {
    required(path.name);
    required(path.expiredAt);
    required(path.selectedCategories);
    required(path.selectedLocations);
  });

  onDateChanged(evt: MatDatepickerInputEvent<Date>): void {
    // FIXME: angular material datepicker can't handle signal forms at the moment: 13102025
    this.dataForm.expiredAt().value.set(evt.value ?? new Date(Date.now()));
  }

  onSubmit() {
    submit(this.dataForm, async (form) => {
      const data = form().value();

      // TODO: change Backend to handle multi categories and locations
      const extended = {
        ...data,
        category: data.selectedCategories.join(','),
        location: data.selectedLocations.join(','),
      } as MedFormData;

      const {
        selectableCategories,
        selectableLocations,
        selectedCategories,
        selectedLocations,
        ...rest
      } = extended;

      this.dialogRef.close(rest as TableRowRequest);

      return null;
    });
  }
}
