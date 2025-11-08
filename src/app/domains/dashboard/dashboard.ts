import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';

import { DashboardTableComponent } from './table/dashboard-table';
import {
  createMedFormData,
  InuseRespone,
  MedFormData,
  TableRow,
  TableRowRequest,
} from './models';
import { HttpService } from '../../core/services/http-service';
import { NotifyService } from '../../core/services/notify-service';
import { ShowModal } from './modals/show-modal';
import { DeleteModal, DeleteModalReturnType } from './modals/delete-modal';
import { AddModal } from './modals/add-modal';
import { EditModal } from './modals/edit-modal';
import { ShoppingListRequest, ShoppingListResponse } from '../shopping/models';

@Component({
  selector: 'ym-dashboard',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard'">
      <div class="container">
        @if (dataRef.isLoading()) {
        <h2>
          {{ t('loading') }}
        </h2>
        } @else if (dataRef.error()) {
        <h2>ERROR!!!!</h2>
        } @else {
        <ym-dashboard-table
          [rows]="dataRef.value()"
          [categories]="categories()"
          (add)="handleAdd()"
          (show)="handleShow($event)"
          (edit)="handleEdit($event)"
          (delete)="handleDelete($event)"
          (inuse)="handleInuse($event)"
        />
        }
      </div>
    </ng-container>
  `,
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, MatButtonModule, DashboardTableComponent],
})
export class DashboardComponent {
  private readonly notifyService = inject(NotifyService);
  private readonly httpService = inject(HttpService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  protected dataRef = rxResource({
    stream: () => this.httpService.get<TableRow[]>('/meds'),
    defaultValue: [],
  });

  protected categoriesRef = rxResource({
    stream: () => this.httpService.get<string[]>('/meds/categories'),
    defaultValue: [],
  });

  protected locationsRef = rxResource({
    stream: () => this.httpService.get<string[]>('/meds/locations'),
    defaultValue: [],
  });

  protected categories = computed(() => {
    const entries = this.categoriesRef.value();
    return Array.from(
      new Set(
        entries.flatMap((entry: string) =>
          entry.includes(',') ? entry.split(',') : entry
        )
      )
    );
  });

  protected locations = computed(() => {
    const entries = this.locationsRef.value();
    return Array.from(
      new Set(
        entries.flatMap((entry: string) =>
          entry.includes(',') ? entry.split(',') : entry
        )
      )
    );
  });

  protected handleAdd(): void {
    this.dialog
      .open(AddModal, {
        data: createMedFormData(this.categories(), this.locations()),
        hasBackdrop: true,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result: TableRowRequest) => {
        if (!result) {
          return;
        }

        this.httpService
          .create<TableRowRequest>('/meds', result)
          .subscribe(() => {
            this.notifyService.show('dashboard.table.added');
            this.refresh();
          });
      });
  }

  protected handleShow(row: TableRow): void {
    this.dialog.open(ShowModal, {
      data: row,
      hasBackdrop: true,
      disableClose: true,
    });
  }

  protected handleEdit(row: TableRow): void {
    this.dialog
      .open(EditModal, {
        data: {
          ...JSON.parse(JSON.stringify(row)),
          selectableCategories: this.categories(),
          selectableLocations: this.locations(),
          // TODO: change Backend to handle multi categories and locations
          selectedCategories: row.category.split(','),
          selectedLocations: row.location.split(','),
        } as MedFormData,
        hasBackdrop: true,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result: TableRowRequest) => {
        if (!result) {
          return;
        }
        this.httpService
          .update<TableRowRequest>(`/meds/${row.id}`, result)
          .subscribe(() => {
            this.notifyService.show('dashboard.table.edit');
            this.refresh();
          });
      });
  }

  protected handleDelete(row: TableRow): void {
    this.dialog
      .open(DeleteModal, {
        data: row,
        hasBackdrop: true,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result: DeleteModalReturnType) => {
        if (result) {
          if (result === 'ONLY_DELETE') {
            this.httpService.delete(`/meds/${row.id}`).subscribe(() => {
              this.notifyService.show('dashboard.table.deleted');
              this.refresh();
            });
          }

          if (result === 'DELETE_AND_ADD') {
            combineLatest({
              delete: this.httpService.delete<{ message: string }>(
                `/meds/${row.id}`
              ),
              add: this.httpService.create<
                ShoppingListRequest,
                ShoppingListResponse
              >(`/shopping-lists`, { name: row.name, company: row.company }),
            })
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(() => {
                this.notifyService.show('dashboard.table.delete-and-added');
                this.refresh();
              });
          }
        }
      });
  }

  protected handleInuse(row: TableRow): void {
    this.httpService
      .patch<TableRow, InuseRespone>(`/meds/${row.id}/inuse`, row)
      .subscribe((result: InuseRespone) => {
        this.notifyService.show(
          `dashboard.table.inuse-${result.update.inUse ? 'on' : 'off'}`
        );
        this.refresh();
      });
  }

  private refresh(): void {
    this.dataRef.reload();
    this.categoriesRef.reload();
    this.locationsRef.reload();
  }
}
