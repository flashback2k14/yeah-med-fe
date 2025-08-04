import { Component, input, model, output } from '@angular/core';
import { TableRow } from '../models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-show-modal',
  template: `
    <div
      class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      [class.hidden]="!open()"
    >
      <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div
          class="relative top-18 left-84 bg-white rounded-lg shadow-sm dark:bg-gray-700"
        >
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ selectedRow()?.name }}
            </h3>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              (click)="handleClose()"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-4 md:p-5 space-y-4">
            @if(selectedRow()?.description) {
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
              {{ selectedRow()?.description }}
            </p>
            } @if(selectedRow()?.productId) {
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
              {{ selectedRow()?.productId }}
            </p>
            }
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
              {{ selectedRow()?.category }} - {{ selectedRow()?.location }}
            </p>
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
              {{ selectedRow()?.expiredAt | date }}
            </p>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <button
              type="button"
              class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              (click)="handleClose()"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [DatePipe],
})
export class ShowModal {
  open = model<boolean>(false);
  selectedRow = input<TableRow | undefined>();

  close = output();
  handleClose = () => this.close.emit();
}
