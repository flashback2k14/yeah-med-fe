import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, computed, input, model, output } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { TranslocoDirective } from '@jsverse/transloco';

import { TableRow } from '../models';
import { IsExpiredPipe } from '../pipes/table-pipes';

@Component({
  selector: 'ym-dashboard-table',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard'">
      <mat-form-field appearance="outline">
        <mat-label>{{ t('table.filter.label') }}</mat-label>
        <input
          matInput
          type="text"
          [(ngModel)]="filter"
          [placeholder]="t('table.filter.placeholder')"
        />
        <button matIconButton matSuffix (click)="clearFilter()">
          <mat-icon>clear</mat-icon>
        </button>
      </mat-form-field>
      <div class="container">
        <table mat-table [dataSource]="this.filteredRows()">
          <!-- Name Column -->
          <ng-container matColumnDef="name" sticky>
            <th mat-header-cell *matHeaderCellDef class="first-column">Name</th>
            <td mat-cell *matCellDef="let element">
              {{ element.name }}
            </td>
          </ng-container>

          <!-- Category Column -->
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let element">{{ element.category }}</td>
          </ng-container>

          <!-- Location Column -->
          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>Location</th>
            <td mat-cell *matCellDef="let element">{{ element.location }}</td>
          </ng-container>

          <!-- Expired At Column -->
          <ng-container matColumnDef="expiredAt">
            <th mat-header-cell *matHeaderCellDef>Expired At</th>
            <td mat-cell *matCellDef="let element">
              {{ element.expiredAt | date }}
            </td>
          </ng-container>

          <!-- Action Column -->
          <ng-container matColumnDef="actions" stickyEnd>
            <th
              mat-header-cell
              *matHeaderCellDef
              aria-label="row actions"
              class="last-column"
            >
              <div class="action-header" (click)="handleAdd()">
                <span>New</span>
                <mat-icon>add</mat-icon>
              </div>
            </th>
            <td mat-cell *matCellDef="let element">
              <div class="action-cell">
                <mat-icon (click)="handleShow(element)">info</mat-icon>
                <mat-icon (click)="handleEdit(element)">edit</mat-icon>
                <mat-icon (click)="handleDelete(element)">delete</mat-icon>
              </div>
            </td>
          </ng-container>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="5">
              <h2 class="no-data">No data available.</h2>
            </td>
          </tr>

          <tr
            mat-header-row
            *matHeaderRowDef="displayedColumns; sticky: true"
            class="no-hover"
          ></tr>
          <tr
            mat-row
            [class.expired]="row.expiredAt | isExpired"
            *matRowDef="let row; columns: displayedColumns"
          ></tr>
        </table>
      </div>
    </ng-container>
  `,
  styleUrl: './dashboard-table.scss',
  imports: [
    DatePipe,
    FormsModule,
    TranslocoDirective,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    IsExpiredPipe,
  ],
})
export class DashboardTableComponent {
  rows = input.required<TableRow[]>();
  filter = model<string>();
  filteredRows = computed(() => {
    const filter = this.filter();
    return filter ? this.applyFilter(filter) : this.rows();
  });

  displayedColumns = ['name', 'category', 'location', 'expiredAt', 'actions'];

  protected add = output<void>();
  protected show = output<TableRow>();
  protected edit = output<TableRow>();
  protected delete = output<TableRow>();

  protected handleAdd = () => this.add.emit();
  protected handleShow = (row: TableRow) => this.show.emit(row);
  protected handleEdit = (row: TableRow) => this.edit.emit(row);
  protected handleDelete = (row: TableRow) => this.delete.emit(row);

  protected clearFilter(): void {
    this.filter.set('');
  }

  private applyFilter(clause: string): TableRow[] {
    return this.rows().filter((row: TableRow) =>
      row.name.toUpperCase().includes(clause.toUpperCase())
    );
  }
}
