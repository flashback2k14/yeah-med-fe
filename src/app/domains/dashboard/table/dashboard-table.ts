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

@Component({
  selector: 'ym-dashboard-table',
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard'">
      <div class="wrapper">
        <mat-accordion>
          <mat-expansion-panel>
            <mat-expansion-panel-header (click)="toggle()">
              Filter
            </mat-expansion-panel-header>
            <!-- FILTER: NAME -->
            <mat-form-field appearance="outline" class="half">
              <mat-label>{{ t('table.filter.name.label') }}</mat-label>
              <input
                matInput
                type="text"
                [(ngModel)]="filterByName"
                [placeholder]="t('table.filter.name.placeholder')"
              />
              <button matIconButton matSuffix (click)="clearFilterByName()">
                <mat-icon>clear</mat-icon>
              </button>
            </mat-form-field>
            <!-- FILTER: CATEGORY -->
            <mat-form-field appearance="outline" class="half spacer">
              <mat-label>{{ t('table.filter.category.label') }}</mat-label>
              <mat-select [(ngModel)]="filterByCategory">
                <mat-option disabled="">{{
                  t('table.filter.category.placeholder')
                }}</mat-option>
                @for(category of categories(); track category) {
                <mat-option [value]="category">{{ category }}</mat-option>
                }
              </mat-select>
              <button matIconButton matSuffix (click)="clearFilterByCategory()">
                <mat-icon>clear</mat-icon>
              </button>
            </mat-form-field>
          </mat-expansion-panel>
        </mat-accordion>
        <!-- TABLE -->
        <div
          [style.--ym-filter-container-height]="containerHeight()"
          class="container"
        >
          <table mat-table [dataSource]="this.filteredRows()">
            <!-- Name Column -->
            <ng-container matColumnDef="name" sticky>
              <th mat-header-cell *matHeaderCellDef class="first-column">
                {{ t('table.columns.name') }}
              </th>
              <td mat-cell *matCellDef="let element">
                {{ element.name }}
              </td>
            </ng-container>

            <!-- Category Column -->
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>
                {{ t('table.columns.category') }}
              </th>
              <td mat-cell *matCellDef="let element">
                <mat-chip-set>
                  @for(category of element.category | split; track category) {
                  <mat-chip>{{ category }}</mat-chip>
                  }
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Location Column -->
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>
                {{ t('table.columns.location') }}
              </th>
              <td mat-cell *matCellDef="let element">
                <mat-chip-set>
                  @for(location of element.location | split; track location) {
                  <mat-chip>{{ location }}</mat-chip>
                  }
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Expired At Column -->
            <ng-container matColumnDef="expiredAt">
              <th mat-header-cell *matHeaderCellDef>
                {{ t('table.columns.expiredAt') }}
              </th>
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
                  <mat-icon>add</mat-icon>
                  <span>{{ t('table.actions.new') }}</span>
                </div>
              </th>
              <td mat-cell *matCellDef="let element">
                <div class="action-cell">
                  <button matButton [matMenuTriggerFor]="actionMenu">
                    <mat-icon>menu</mat-icon>
                    <span>{{ t('table.actions.title') }}</span>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item (click)="handleEdit(element)">
                      <mat-icon>edit</mat-icon>
                      <span>{{ t('table.actions.edit') }}</span>
                    </button>
                    <button mat-menu-item (click)="handleDelete(element)">
                      <mat-icon>delete</mat-icon>
                      <span>{{ t('table.actions.delete') }}</span>
                    </button>
                    <button mat-menu-item (click)="handleInuse(element)">
                      <mat-icon svgIcon="inuse"></mat-icon>
                      <span>{{ t('table.actions.inuse') }}</span>
                    </button>
                    <button
                      mat-menu-item
                      (click)="handleShow(element)"
                      [disabled]="!(element.description || element.productId)"
                    >
                      <mat-icon>info</mat-icon>
                      <span>{{ t('table.actions.more') }}</span>
                    </button>
                  </mat-menu>
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
              [class.in-use]="row.inUse"
              *matRowDef="let row; columns: displayedColumns"
            ></tr>
          </table>
        </div>
      </div>
    </ng-container>
  `,
  styleUrl: './dashboard-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FormsModule,
    IsExpiredPipe,
    MatButtonModule,
    MatChipsModule,
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
        return 'calc(100vh - 222px - 96px - 88px - 32px)';
      } else {
        return 'calc(100vh - 4px - 96px - 88px - 42px - 156px)';
      }
    } else {
      if (isMobile) {
        return 'calc(100vh - 4px - 96px - 88px - 42px - 18px)';
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

  protected handleAdd = () => this.add.emit();
  protected handleShow = (row: TableRow) => this.show.emit(row);
  protected handleEdit = (row: TableRow) => this.edit.emit(row);
  protected handleDelete = (row: TableRow) => this.delete.emit(row);
  protected handleInuse = (row: TableRow) => this.inuse.emit(row);

  protected clearFilterByName(): void {
    this.filterByName.set('');
  }

  protected clearFilterByCategory(): void {
    this.filterByCategory.set('');
  }

  protected toggle(): void {
    this.toggleValue.set(!this.toggleValue());
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
