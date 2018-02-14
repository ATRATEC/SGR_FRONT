import { Directive, EventEmitter, Input, ElementRef, Inject } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective {

  private focusEmitterSubscription;
    // Now we expect EventEmitter as binded value
    @Input('focus')
    set focus(focusEmitter: EventEmitter<any>) {
        if (this.focusEmitterSubscription) {
            this.focusEmitterSubscription.unsubscribe();
        }
        this.focusEmitterSubscription = focusEmitter.subscribe(
            (() => this.element.nativeElement.focus()).bind(this));
    }
    constructor(@Inject(ElementRef) private element: ElementRef) {}

}
