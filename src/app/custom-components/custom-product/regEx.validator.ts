import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";

export class RegexConstants {
  public static NUMBER_1_99 = /^(0?[1-9]|[1-9][0-9])$/; // Accepts 01-99 or 1-99 numbers
  public static NUMBER_1_999 = /^(0?[1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/; // Accepts 01-999 or 1-999 numbers
  public static ANGLE_0_360 = /\b([0-2]?[0-9]{1,2}|3[0-5][0-9]|360)\b|-\b([0-2]?[0-9]{1,2}|3[0-5][0-9]|360)\b/; // Accepts 01-999 or 1-999 numbers
  public static DECIMAL_4_3 = /^-?(\d{0,4}(\.\d{1,3})?)$/; // Accepts Decimal upto 3 decimal digits from 1 to 1000
  public static BUNDLE_NAME = /^[a-zA-Z0-9]{0,2}$/; // Accepts only alphabets and umbers with 2 characters
  public static JOB_REFERENCE = /^[a-zA-Z0-9-\/+\s-\']{0,15}$/; // Accepts only alphabets A-Z or a-z with 2 digits
}

export function RegexValidator(reg: RegexConstants): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && !control.value.toString().match(reg)) {
      return { invalid: true };
    }
    return null;
  };
}
