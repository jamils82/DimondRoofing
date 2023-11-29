import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDatePipe'
})
export class CustomDatePipe implements PipeTransform {
  timeDifference: any;
  constructor(public datePipe: DatePipe) {

  }
  transform(value: any, format: string): string {
    const d = new Date();
    let diff = d.getTimezoneOffset();
    this.timeDifference = diff / 60;
    const sign = diff > 0 ? '+' : '-';
    const zone: string = sign + this.timeDifference + '00';
    value = this.datePipe.transform(value, format , value);
    return value;
  }

}
