import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isExpired',
})
export class IsExpiredPipe implements PipeTransform {
  transform(expiredDate: Date): boolean {
    return new Date(Date.now()) > new Date(expiredDate);
  }
}
