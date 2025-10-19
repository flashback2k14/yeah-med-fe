import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isExpired',
})
export class IsExpiredPipe implements PipeTransform {
  transform(expiredDate: Date): boolean {
    return new Date(Date.now()) > new Date(expiredDate);
  }
}

@Pipe({
  name: 'split',
})
export class SplitPipe implements PipeTransform {
  transform(val: string, params?: string): string[] {
    return val.split(params ?? ',');
  }
}
