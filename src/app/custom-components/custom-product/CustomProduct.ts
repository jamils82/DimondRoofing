
import { Validators } from "@angular/forms";
import { RegexValidator, RegexConstants } from "./regEx.validator";

export class ProductQuantity {
  prodQty = ['', [RegexValidator(RegexConstants.NUMBER_1_99), Validators.required]];
  prodLen = ['', [RegexValidator(RegexConstants.DECIMAL_4_3), Validators.required]];
  prodBundle = ['', [RegexValidator(RegexConstants.BUNDLE_NAME), Validators.required]];
  prodRef = ['', [RegexValidator(RegexConstants.JOB_REFERENCE), Validators.required]];
};

export class ProductQuantityNonComplex {
  prodQty = ['', [RegexValidator(RegexConstants.NUMBER_1_99), Validators.required]];
};

export class FlashingQuantity {
  prodQty = ['', [RegexValidator(RegexConstants.NUMBER_1_99), Validators.required]];
  prodLen = ['', [RegexValidator(RegexConstants.DECIMAL_4_3), Validators.required]];
};

export class AccessoriesQuantity {
  prodQty = ['', [RegexValidator(RegexConstants.NUMBER_1_99), Validators.required]];
};

export class CartForm {
  prodQty = ['', [RegexValidator(RegexConstants.NUMBER_1_99), Validators.required]];
  jobReference = ['', [RegexValidator(RegexConstants.JOB_REFERENCE)]];
};

export class FlashGuardDetails {
  type = ['', [Validators.required]];
  dimension = ['', [Validators.required]];
  fold = ['', [Validators.required]];
};

export class DimensionDetails {
  dimension = ['', [RegexValidator(RegexConstants.NUMBER_1_999), Validators.required]];
  angle = ['', [RegexValidator(RegexConstants.ANGLE_0_360), Validators.required]];
};

export const errorMessage = 'Some error occurred while processing data';
