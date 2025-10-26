import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Field, form, required, submit } from '@angular/forms/signals';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';
import { ShoppingListRequest, ShoppingListResponse } from '../models';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'ym-shopping-list-sheet',
  template: `
    <ng-container *transloco="let t; prefix: 'shopping.shopping-entry'">
      <form novalidate>
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

          <!-- COMPANY -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ t('company.label') }}</mat-label>
            <input
              matInput
              type="text"
              [placeholder]="t('company.placeholder')"
              [field]="dataForm.company"
            />
          </mat-form-field>

          <div class="actions">
            <button matButton (click)="close($event)">
              {{ t('actions.close') }}
            </button>
            <button
              matButton
              [disabled]="!dataForm().valid()"
              (click)="onSubmit($event)"
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
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoDirective,
  ],
})
export class ShoppingSheet {
  private bottomSheetRef =
    inject<MatBottomSheetRef<ShoppingSheet, ShoppingListRequest>>(
      MatBottomSheetRef
    );
  protected readonly data = inject<ShoppingListResponse>(MAT_BOTTOM_SHEET_DATA);

  protected dataModel = signal<ShoppingListResponse>(this.data);
  protected dataForm = form(this.dataModel, (path) => {
    required(path.name);
  });

  close(event: Event): void {
    event.preventDefault();
    this.bottomSheetRef.dismiss();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.dataForm, async (form) => {
      this.bottomSheetRef.dismiss({
        ...form().value(),
      });
      return null;
    });
  }
}
