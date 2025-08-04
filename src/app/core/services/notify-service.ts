import {
  ComponentRef,
  DestroyRef,
  inject,
  Injectable,
  inputBinding,
  outputBinding,
  Signal,
  ViewContainerRef,
} from '@angular/core';
import { NotifyComponent, NotifyType } from '../../shared/components/notify';
import { HashMap, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  private readonly translator = inject(TranslocoService);
  private readonly destroyDef = inject(DestroyRef);

  private vcr: Signal<ViewContainerRef | undefined> | undefined;
  private compRef: ComponentRef<NotifyComponent> | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;

  public init(vcr: Signal<ViewContainerRef | undefined>): void {
    this.vcr = vcr;
  }

  public show(
    messageKey: string,
    params?: HashMap,
    type: NotifyType = NotifyType.SUCCESS
  ): void {
    this.vcr?.()?.clear();

    this.translator
      .selectTranslate(messageKey, { ...params })
      .pipe(takeUntilDestroyed(this.destroyDef))
      .subscribe((value) => {
        this._show(value, type);
      });
  }

  public showError(err: any) {
    this._show(
      err?.error?.message ??
        this.translator.translate('notification.error.default-http'),
      NotifyType.ERROR
    );
  }

  private _show(value: string, type: NotifyType) {
    this.compRef = this.vcr?.()?.createComponent(NotifyComponent, {
      bindings: [
        inputBinding('text', () => value),
        inputBinding('type', () => type),
        outputBinding('click', () => {
          this.compRef?.destroy();
          this.compRef = undefined;
          if (this.timer) {
            clearTimeout(this.timer);
          }
        }),
      ],
    });

    this.timer = setTimeout(() => {
      this.compRef?.destroy();
      this.compRef = undefined;
    }, 3000);
  }
}
