import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoDirective } from '@jsverse/transloco';

import { TableRow } from '../models';

@Component({
  selector: 'ym-show-modal',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard.show-modal'">
      <h2 mat-dialog-title>{{ t('title') }}</h2>
      <mat-dialog-content class="mat-typography">
        <label>{{ t('labels.name') }}</label>
        <mat-divider />
        <p>{{ selectedRow.name }}</p>

        @if(selectedRow.description) {
        <label>{{ t('labels.desc') }}</label>
        <mat-divider />
        <p>
          {{ selectedRow.description }}
        </p>
        }

        <label>{{ t('labels.catLoc') }}</label>
        <mat-divider />
        <p>{{ selectedRow.category }} / {{ selectedRow.location }}</p>

        <label>{{ t('labels.expiredAt') }}</label>
        <mat-divider />
        <p>
          {{ selectedRow.expiredAt | date : 'dd.MM.yyyy' }}
        </p>

        @if(selectedRow.productId) {
        <label>{{ t('labels.productId') }}</label>
        <mat-divider />
        <p>
          {{ selectedRow.productId }}
        </p>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button matButton [mat-dialog-close]="true" cdkFocusInitial>
          {{ t('actions.close') }}
        </button>
      </mat-dialog-actions>
    </ng-container>
  `,
  styles: `
    label {
      font: var(--mat-sys-body-large);
    }
  `,
  imports: [
    DatePipe,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    TranslocoDirective,
  ],
})
export class ShowModal {
  selectedRow = inject<TableRow>(MAT_DIALOG_DATA);
}
