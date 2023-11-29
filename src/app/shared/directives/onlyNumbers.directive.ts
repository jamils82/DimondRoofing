import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[OnlyNumber]",
})
export class OnlyNumber {
  constructor(private el: ElementRef) {}

  regexStr = '^[+-]?\d*\.?\d{0,9}$';

  @Input() OnlyNumber: any;

  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    let e = <KeyboardEvent>event;
    if (this.OnlyNumber === true || this.OnlyNumber === "true") {
      if (
        // Allow: 96 - 105 for keyboard side numbers
        [46, 8, 9, 27, 13, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 189, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+V
        (e.keyCode == 86 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        // let it happen, don't do anything
        return;
      }
      let ch = String.fromCharCode(e.keyCode);
      let regEx = new RegExp(this.regexStr);
      if (regEx.test(ch)) return;
      else e.preventDefault();
    }
  }
}
