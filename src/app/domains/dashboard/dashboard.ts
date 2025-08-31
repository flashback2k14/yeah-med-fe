import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { DashboardTableComponent } from './table/dashboard-table';
import { TableRow, TableRowRequest } from './models';
import { HttpService } from '../../core/services/http-service';
import { NotifyService } from '../../core/services/notify-service';
import { ShowModal } from './modals/show-modal';
import { DeleteModal } from './modals/delete-modal';
import { AddModal } from './modals/add-modal';
import { EditModal } from './modals/edit-modal';

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
          (add)="handleAdd()"
          (show)="handleShow($event)"
          (edit)="handleEdit($event)"
          (delete)="handleDelete($event)"
        />
        }
      </div>
    </ng-container>
  `,
  styleUrl: './dashboard.scss',
  imports: [TranslocoDirective, MatButtonModule, DashboardTableComponent],
})
export class DashboardComponent {
  private readonly notifyService = inject(NotifyService);
  private readonly httpService = inject(HttpService);
  private readonly dialog = inject(MatDialog);

  protected dataRef = rxResource({
    stream: () => this.httpService.get<TableRow[]>('/meds'),
    defaultValue: [],
  });

  protected handleAdd(): void {
    this.dialog
      .open(AddModal, { width: '40%', hasBackdrop: true })
      .afterClosed()
      .subscribe((result: TableRowRequest) => {
        if (!result) {
          return;
        }

        this.httpService
          .create<TableRowRequest>('/meds', result)
          .subscribe(() => {
            this.notifyService.show('dashboard.table.added');
            this.dataRef.reload();
          });
      });
  }

  protected handleShow(row: TableRow): void {
    this.dialog.open(ShowModal, {
      data: row,
      width: '40%',
      hasBackdrop: true,
    });
  }

  protected handleEdit(row: TableRow): void {
    this.dialog
      .open(EditModal, {
        data: JSON.parse(JSON.stringify(row)),
        width: '40%',
        hasBackdrop: true,
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
            this.dataRef.reload();
          });
      });
  }

  protected handleDelete(row: TableRow): void {
    this.dialog
      .open(DeleteModal, {
        data: row,
        width: '40%',
        hasBackdrop: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.httpService.delete(`/meds/${row.id}`).subscribe(() => {
            this.notifyService.show('dashboard.table.deleted');
            this.dataRef.reload();
          });
        }
      });
  }
}
