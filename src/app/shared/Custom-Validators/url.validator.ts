import { FormGroup } from '@angular/forms';

export function URLValidator(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if (control.errors && !control.errors.invalidURL) {
      // return if another validator has already found an error on the control
      return;
    }

    // set error on control if validation fails
    try {
      const serviceUrl = new URL(control.value);
      control.setErrors(null);
    } catch (_) {
      control.setErrors({ invalidURL: true });
    }
  };
}
