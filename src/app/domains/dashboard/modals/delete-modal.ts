import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoDirective } from '@jsverse/transloco';

import { TableRow } from '../models';

@Component({
  selector: 'ym-delete-modal',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard.delete-modal'">
      <h2 mat-dialog-title>{{ t('title') }}</h2>
      <mat-dialog-content class="mat-typography">
        <p>{{ selectedRow.name }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button matButton mat-dialog-close cdkFocusInitial>
          {{ t('actions.no') }}
        </button>
        <button matButton [mat-dialog-close]="true">
          {{ t('actions.yes') }}
        </button>
      </mat-dialog-actions>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, TranslocoDirective],
})
export class DeleteModal {
  selectedRow = inject<TableRow>(MAT_DIALOG_DATA);
}
