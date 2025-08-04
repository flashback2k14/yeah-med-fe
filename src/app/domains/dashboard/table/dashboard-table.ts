import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TableRow } from '../models';

@Component({
  selector: 'app-dashboard-table',
  template: `
    <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          class="w-85 sm:w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <!-- Quick infos: Name, Category, Location, Expired At, the rest in dialog -->
            <tr>
              <th scope="col" class="px-6 py-3">Name</th>
              <th scope="col" class="px-6 py-3">Category</th>
              <th scope="col" class="px-6 py-3">Location</th>
              <th scope="col" class="px-6 py-3">Expired At</th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Actions</span>
                <span (click)="handleAdd()">
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white hover:text-blue-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 12h14m-7 7V5"
                    />
                  </svg>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track row.id) {
            <tr
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                (click)="handleShow(row)"
              >
                {{ row.name }}
              </td>
              <td class="px-6 py-4">
                {{ row.category }}
              </td>
              <td class="px-6 py-4">
                {{ row.location }}
              </td>
              <td class="px-6 py-4">
                {{ row.expiredAt | date }}
              </td>
              <td class="px-6 py-4 flex">
                <span class="pr-4" (click)="handleEdit(row)">
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white hover:text-blue-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                    />
                  </svg>
                </span>
                <span (click)="handleDelete(row)">
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white hover:text-blue-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                    />
                  </svg>
                </span>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
  imports: [DatePipe],
})
export class DashboardTableComponent {
  rows = input<TableRow[]>();

  protected add = output<void>();
  protected show = output<TableRow>();
  protected edit = output<TableRow>();
  protected delete = output<TableRow>();

  protected handleAdd = () => this.add.emit();
  protected handleShow = (row: TableRow) => this.show.emit(row);
  protected handleEdit = (row: TableRow) => this.edit.emit(row);
  protected handleDelete = (row: TableRow) => this.delete.emit(row);
}
