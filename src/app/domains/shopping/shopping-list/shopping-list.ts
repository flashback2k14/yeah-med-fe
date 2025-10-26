import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';

import { NotifyService } from '../../../core/services/notify-service';
import { HttpService } from '../../../core/services/http-service';
import { ShoppingSheet } from '../sheets/shopping-sheet';
import {
  createShoppingListRequest,
  ShoppingListRequest,
  ShoppingListResponse,
} from '../models';

@Component({
  selector: 'ym-shopping-list',
  template: `
    <ng-container *transloco="let t; prefix: 'shopping.shopping-list'">
      <div class="title">
        <span>{{ t('title') }}</span>
      </div>

      <div class="list">
        @if (shoppingListRef.isLoading()) {
        <h2>{{ t('loading') }}</h2>
        } @else if (shoppingListRef.error()) {
        <h2>{{ t('error') }}</h2>
        <div>{{ shoppingListRef.error()?.message }}</div>
        } @else {
        <!-- -->
        <mat-list>
          @for (entry of shoppingListRef.value(); track entry.id) {
          <mat-list-item>
            <mat-icon matListItemIcon>radio_button_unchecked</mat-icon>
            <div matListItemMeta>
              <mat-icon (click)="handleEdit(entry)">edit</mat-icon>
              <mat-icon (click)="handleDelete(entry)">delete</mat-icon>
            </div>
            <div matListItemTitle>{{ entry.name }}</div>
            @if(entry.company) {
            <div matListItemLine>{{ entry.company }}</div>
            }
          </mat-list-item>
          @if (!$last) {
          <mat-divider></mat-divider>
          }
          <!-- -->
          } @empty {
          <h2>{{ t('no-data') }}</h2>
          }
          <!-- -->
        </mat-list>
        }
      </div>

      <div class="actions">
        <button matFab (click)="openSheet()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
    </ng-container>
  `,
  styleUrl: './shopping-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    TranslocoDirective,
  ],
})
export class ShoppingListComponent {
  private readonly notifyService = inject(NotifyService);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly httpService = inject(HttpService);

  protected shoppingListRef = rxResource({
    stream: () =>
      this.httpService.get<ShoppingListResponse[]>('/shopping-lists'),
    defaultValue: [],
  });

  handleDelete(entry: ShoppingListResponse) {
    const confirmed = confirm(
      'Are you sure to delete the entry: ' + entry.name + '?'
    );

    if (confirmed) {
      this.httpService.delete('/shopping-lists/' + entry.id).subscribe(() => {
        this.notifyService.show('shopping.shopping-list.notify.deleted');
        this.shoppingListRef.reload();
      });
    }
  }

  handleEdit(entry: ShoppingListResponse) {
    this.bottomSheet
      .open(ShoppingSheet, {
        data: JSON.parse(JSON.stringify(entry)),
        hasBackdrop: true,
        disableClose: true,
      })
      .afterDismissed()
      .subscribe((result: ShoppingListRequest) => {
        if (!result) {
          return;
        }
        const data = {
          ...entry,
          ...result,
        };
        this.httpService
          .update<ShoppingListResponse>(`/shopping-lists/${entry.id}`, data)
          .subscribe(() => {
            this.notifyService.show('shopping.shopping-list.notify.edit');
            this.shoppingListRef.reload();
          });
      });
  }

  openSheet(): void {
    this.bottomSheet
      .open(ShoppingSheet, {
        data: createShoppingListRequest(),
        hasBackdrop: true,
        disableClose: true,
      })
      .afterDismissed()
      .subscribe((result: ShoppingListRequest) => {
        if (!result) {
          return;
        }

        this.httpService
          .create<ShoppingListRequest>('/shopping-lists', result)
          .subscribe(() => {
            this.notifyService.show('shopping.shopping-list.notify.added');
            this.shoppingListRef.reload();
          });
      });
  }
}
