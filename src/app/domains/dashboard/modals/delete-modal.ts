import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslocoDirective } from '@jsverse/transloco';

import { TableRow } from '../models';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Field, form, submit } from '@angular/forms/signals';

export type DeleteModalReturnType = 'ONLY_DELETE' | 'DELETE_AND_ADD';

@Component({
  selector: 'ym-delete-modal',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard.delete-modal'">
      <form>
        <h2 mat-dialog-title>{{ t('title') }}</h2>
        <mat-dialog-content class="mat-typography">
          <p>{{ selectedRow.name }}</p>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
          <div class="actions">
            <div>
              <mat-checkbox [field]="dataForm"
                >Add to shopping list</mat-checkbox
              >
            </div>
            <div>
              <button matButton mat-dialog-close cdkFocusInitial>
                {{ t('actions.no') }}
              </button>
              <button matButton (click)="onSubmit($event)">
                {{ t('actions.yes') }}
              </button>
            </div>
          </div>
        </mat-dialog-actions>
      </form>
    </ng-container>
  `,
  styleUrl: './modals.scss',
  styles: `
    p {
      font: var(--mat-sys-body-large);
      padding-left: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Field,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    TranslocoDirective,
  ],
})
export class DeleteModal {
  protected readonly dialogRef = inject(MatDialogRef<DeleteModal>);
  protected readonly selectedRow = inject<TableRow>(MAT_DIALOG_DATA);

  protected dataModel = signal(false);
  protected dataForm = form(this.dataModel);

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.dataForm, async (form) => {
      this.dialogRef.close(form().value() ? 'DELETE_AND_ADD' : 'ONLY_DELETE');
    });
  }
}
