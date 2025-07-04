import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesNo',
  standalone: true,
})
export class YesNoPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return value ? 'Si' : 'No';
  }
}
