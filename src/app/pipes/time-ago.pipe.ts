import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): unknown {
    const date = new Date(value);
    const today = new Date();
    return formatDistance(today, date, { locale: es });
  }
}
