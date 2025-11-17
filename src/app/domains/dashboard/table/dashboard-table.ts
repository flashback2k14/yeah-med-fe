import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';

import { TranslocoDirective } from '@jsverse/transloco';

import { IsExpiredPipe, SplitPipe } from '../../../shared/pipes';
import { TableRow } from '../models';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ym-dashboard-table',
  templateUrl: './dashboard-table.html',
  styleUrl: './dashboard-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FormsModule,
    IsExpiredPipe,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    SplitPipe,
    TranslocoDirective,
  ],
})
export class DashboardTableComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private toggleValue = signal<boolean>(false);

  rows = input.required<TableRow[]>();
  categories = input.required<string[]>();

  filterByName = model<string>();
  filterByCategory = model<string>();

  filteredRows = computed(() => {
    const filterByName = this.filterByName();
    const filterByCateory = this.filterByCategory();
    return filterByName
      ? this.applyFilterByName(filterByName)
      : filterByCateory
      ? this.applyFilterByCategory(filterByCateory)
      : this.rows();
  });

  containerHeight = computed(() => {
    const isOpened = this.toggleValue();
    const isMobile = this.breakpointObserver.isMatched('(max-width: 959px)');

    if (isOpened) {
      if (isMobile) {
        return 'calc(100vh - 222px - 96px - 54px)';
      } else {
        return 'calc(100vh - 4px - 96px - 88px - 42px - 144px)';
      }
    } else {
      if (isMobile) {
        return 'calc(100vh - 4px - 70px - 72px - 42px - 18px)';
      } else {
        return 'calc(100vh - 4px - 96px - 88px - 42px - 48px)';
      }
    }
  });

  displayedColumns = ['name', 'category', 'location', 'expiredAt', 'actions'];

  protected add = output<void>();
  protected show = output<TableRow>();
  protected edit = output<TableRow>();
  protected delete = output<TableRow>();
  protected inuse = output<TableRow>();
  protected addToShopping = output<TableRow>();

  protected handleAdd = () => this.add.emit();
  protected handleShow = (row: TableRow) => this.show.emit(row);
  protected handleEdit = (row: TableRow) => this.edit.emit(row);
  protected handleDelete = (row: TableRow) => this.delete.emit(row);
  protected handleInuse = (row: TableRow) => this.inuse.emit(row);
  protected handleAddToShopping = (row: TableRow) =>
    this.addToShopping.emit(row);

  protected toggle(): void {
    this.toggleValue.set(!this.toggleValue());
  }

  protected clearFilterByName(): void {
    this.filterByName.set('');
  }

  protected clearFilterByCategory(): void {
    this.filterByCategory.set('');
  }

  private applyFilterByName(clause: string): TableRow[] {
    return this.rows().filter((row: TableRow) =>
      row.name.toUpperCase().includes(clause.toUpperCase())
    );
  }

  private applyFilterByCategory(clause: string): TableRow[] {
    return this.rows().filter((row: TableRow) =>
      row.category.toUpperCase().includes(clause.toUpperCase())
    );
  }
}
