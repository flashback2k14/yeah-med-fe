import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DashboardTableComponent } from './table/dashboard-table';
import { TableRow, TableRowRequest } from './models';
import { HttpService } from '../../core/services/http-service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { NotifyService } from '../../core/services/notify-service';
import { ShowModal } from './modals/show-modal';

@Component({
  selector: 'app-dashboard',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard'">
      <app-dashboard-table
        [rows]="rows()"
        (add)="handleAdd()"
        (show)="handleShow($event)"
        (edit)="handleEdit($event)"
        (delete)="handleDelete($event)"
      />

      @if(hasNoData()) {
      <h2
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ t('no-data') }}
      </h2>
      }

      <app-show-modal
        [open]="openShowModal()"
        [selectedRow]="selectedRow()"
        (close)="this.openShowModal.set(false)"
      />
    </ng-container>
  `,
  imports: [TranslocoDirective, DashboardTableComponent, ShowModal],
})
export class DashboardComponent {
  private readonly notifyService = inject(NotifyService);
  private readonly httpService = inject(HttpService);

  private rowsRef = rxResource({
    stream: () => this.httpService.get<TableRow[]>('/meds'),
    defaultValue: [],
  });

  protected rows = this.rowsRef.value;
  protected hasNoData = computed(() => this.rows().length === 0);

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
      this.rowsRef.reload();
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
      this.rowsRef.reload();
    });
  }
}
