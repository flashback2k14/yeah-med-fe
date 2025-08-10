import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';

import { DashboardTableComponent } from './table/dashboard-table';
import { TableRow, TableRowRequest } from './models';
import { HttpService } from '../../core/services/http-service';
import { NotifyService } from '../../core/services/notify-service';
import { ShowModal } from './modals/show-modal';

@Component({
  selector: 'ym-dashboard',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard'">
      <div class="container">
        <ym-dashboard-table
          [rows]="dataRef.value()"
          (add)="handleAdd()"
          (show)="handleShow($event)"
          (edit)="handleEdit($event)"
          (delete)="handleDelete($event)"
        />

        @if (dataRef.isLoading()) {
        <h2>
          {{ t('loading') }}
        </h2>
        }

        <!-- <app-show-modal
        [open]="openShowModal()"
        [selectedRow]="selectedRow()"
        (close)="this.openShowModal.set(false)"
      /> -->
      </div>
    </ng-container>
  `,
  styleUrl: './dashboard.scss',
  imports: [
    TranslocoDirective,
    MatButtonModule,
    DashboardTableComponent,
    // ShowModal,
  ],
})
export class DashboardComponent {
  private readonly notifyService = inject(NotifyService);
  private readonly httpService = inject(HttpService);

  protected dataRef = rxResource({
    stream: () => this.httpService.get<TableRow[]>('/meds'),
    defaultValue: [],
  });

  protected selectedRow = signal<TableRow | undefined>(undefined);
  protected openShowModal = signal<boolean>(false);

  protected handleAdd(): void {
    const data = {
      name: 'Med ' + Math.random(),
      category: 'Category ' + Math.random(),
      description: 'Desc ' + Math.random(),
      location: 'Loc ' + Math.random(),
      productId: 'pid ' + Math.random(),
      expiredAt: new Date(Date.now()),
    } as TableRowRequest;
    this.httpService.create<TableRowRequest>('/meds', data).subscribe(() => {
      this.notifyService.show('dashboard.table.added');
      this.dataRef.reload();
    });
  }

  protected handleShow(row: TableRow): void {
    this.selectedRow.set(row);
    this.openShowModal.set(true);
  }

  protected handleEdit(row: TableRow): void {
    console.log('edit', row);
  }

  protected handleDelete(row: TableRow): void {
    console.log('delete', row);

    this.httpService.delete(`/meds/${row.id}`).subscribe(() => {
      this.notifyService.show('dashboard.table.deleted');
      this.dataRef.reload();
    });
  }
}
