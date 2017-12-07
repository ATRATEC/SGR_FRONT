import { AlertSettings } from './../alert-settings';
import { AlertsService } from './../alerts.service';
import { Component,
         OnInit,
         ViewContainerRef,
         OnDestroy,
         Input,
         ComponentFactoryResolver,
         ViewChild,
         Injector,
         TemplateRef,
         ReflectiveInjector} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertComponent } from './../alert/alert.component';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
  entryComponents: [AlertComponent]
})
export class AlertsComponent implements OnInit, OnDestroy {

  @ViewChild('comp', {read: ViewContainerRef}) compViewContainerRef: ViewContainerRef;

  @Input() set defaultSettings(settings: AlertSettings) {
    this.settings = Object.assign({}, this.settings, settings);
  }

  settings: AlertSettings = {
    overlay: true,
    overlayClickToClose: true,
    showCloseButton: true,
    duration: 3000
  };

  private _current: any;
  private _latestSub: any;
  private _listener: any;

  constructor(private _service: AlertsService,
              private _resolver: ComponentFactoryResolver,
              private _domSanitize: DomSanitizer) { }

  ngOnInit() {
    this._listener = this._service.alert$.subscribe(alert => {
      if (this._current) {
        if (alert.close) {
          setTimeout(() => this._destroy(), 450);
        } else {
          this._destroy();
        }
      }

      if (alert.close) {
        return;
      }

      const settingsFinal = {};

      for (const key in this.settings) {
        if (this.settings.hasOwnProperty(key)) {
          settingsFinal[key] = alert.override[key] !== undefined ? alert.override[key] : this.settings[key];
        }
      }

      const injector: Injector =  ReflectiveInjector.resolveAndCreate([], this.compViewContainerRef.parentInjector);
      // Injector.create([], this.compViewContainerRef.parentInjector);
      const factory = this._resolver.resolveComponentFactory(AlertComponent);
      const component = factory.create(injector);

      component.instance.type = alert.type || 'success';
      component.instance.incomingData = {
        ...this._buildItemTemplate('message', alert.message),
        ...this._buildItemTemplate('title', alert.title),
        ...settingsFinal
      };

      this.compViewContainerRef.insert(component.hostView);

      this._current = component;

      this._latestSub = component.instance.close.subscribe((res: any) => {
        this._service.alert$.next(res);
      });
    });
  }

  ngOnDestroy() {
    this._listener.unsubscribe();
  }

  private _destroy() {
    /**
     * We run the check twice in case the component timed out
     * This can happen on short durations
     */

    if (this._current) {
      this._current.destroy();
      this._current = null;
    }

    this._latestSub.unsubscribe();
  }

  private _buildItemTemplate(key: string, value: any) {
    if (value instanceof TemplateRef) {
      return {[key]: value, [`${key}IsTemplate`]: true};
    } else {
      return {[key]: this._domSanitize.bypassSecurityTrustHtml(value)};
    }
  }

}
