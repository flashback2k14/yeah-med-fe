import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ENTER, COMMA } from '@angular/cdk/keycodes';

import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'ym-autocomplete',
  template: `
    <ng-container *transloco="let t">
      <mat-form-field appearance="outline">
        <mat-label>{{ t(labelKey()) }}</mat-label>
        <mat-chip-grid #chipGrid required="">
          @for (entry of selectedEntries(); track $index) {
          <mat-chip-row (removed)="remove(entry)">
            {{ entry }}
            <button matChipRemove [attr.aria-label]="'remove ' + entry">
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip-row>
          }
        </mat-chip-grid>
        <input
          name="current"
          [placeholder]="t(placeholderKey())"
          #input
          [(ngModel)]="currentInput"
          [matChipInputFor]="chipGrid"
          [matAutocomplete]="auto"
          [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
          (matChipInputTokenEnd)="add($event)"
        />
        <mat-autocomplete
          #auto="matAutocomplete"
          (optionSelected)="onOptionSelected($event); input.value = ''"
        >
          @for (entry of filteredInput(); track entry) {
          <mat-option [value]="entry">{{ entry }}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </ng-container>
  `,
  styles: `
    mat-form-field {
      width: inherit;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    TranslocoDirective,
  ],
})
export class AutocompleteComponent {
  readonly labelKey = input('');
  readonly placeholderKey = input('');
  readonly all = model<string[]>([]);
  readonly selectedEntries = model<string[]>([]);
  readonly selected = output<string[]>();

  readonly currentInput = signal('');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  readonly filteredInput = computed(() => {
    const loweredCurrent = this.currentInput().toLowerCase();
    return loweredCurrent
      ? this.all().filter((entry) =>
          entry.toLowerCase().includes(loweredCurrent)
        )
      : this.all().slice();
  });

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedEntries.update((entries) => [...entries, value]);
      this.selected.emit(this.selectedEntries());
    }

    this.currentInput.set('');
  }

  remove(entry: string): void {
    this.selectedEntries.update((entries) => {
      const index = entries.indexOf(entry);
      if (index < 0) {
        return entries;
      }

      entries.splice(index, 1);
      return [...entries];
    });
    this.selected.emit(this.selectedEntries());
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedEntries.update((entries) => [
      ...entries,
      event.option.viewValue,
    ]);
    this.currentInput.set('');
    event.option.deselect();
    this.selected.emit(this.selectedEntries());
  }
}
