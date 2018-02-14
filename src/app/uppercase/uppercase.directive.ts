import { Directive, Renderer, ElementRef, forwardRef, Renderer2, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, DefaultValueAccessor } from '@angular/forms';

const UPPERCASE_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UppercaseDirective),
  multi: true,
};

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'input[uppercase]',
  providers: [
    UPPERCASE_INPUT_CONTROL_VALUE_ACCESSOR,
  ],
})
export class UppercaseDirective extends DefaultValueAccessor {

  @HostListener('input', ['$event.target']) onInput(target) {
    const transformed = this.transformValue(target.value);

    super.writeValue(transformed);
    this.onChange(transformed);
  }

  @HostListener('blur', ['$event.target']) onblur(target) {
    const transformed = this.transformValue(target.value);

    super.writeValue(transformed);
    this.onChange(transformed);
  }

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    super(renderer, elementRef, false);
  }

  writeValue(value: any): void {
    const transformed = this.transformValue(value);

    super.writeValue(transformed);
  }

  // onInput(value: any): void {
  //   const transformed = this.transformValue(value);

  //   super.writeValue(transformed);
  //   this.onChange(transformed);
  // }

  private transformValue(value: any): any {
    const result = value && typeof value === 'string'
      ? value.toUpperCase()
      : value;

    return result;
  }

}
