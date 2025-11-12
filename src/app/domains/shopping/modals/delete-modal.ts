import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'ym-shopping-delete-modal',
  template: `
    <ng-container *transloco="let t; prefix: 'shopping.delete-modal'">
      <h2 mat-dialog-title>{{ t('title') }}</h2>
      <mat-dialog-content class="mat-typography">
        <p>{{ name }}</p>
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
  styles: `
    p {
      font: var(--mat-sys-body-large);
      padding-left: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDialogModule, TranslocoDirective],
})
export class ShoppingDeleteModal {
  name = inject<string>(MAT_DIALOG_DATA);
}
