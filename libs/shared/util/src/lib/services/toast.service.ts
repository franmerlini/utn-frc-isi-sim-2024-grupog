import { Injectable, inject } from '@angular/core';

import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  #messageService = inject(MessageService);

  info(summary: string, detail: string): void {
    this.#messageService.add({ severity: 'info', summary, detail });
  }

  success(summary: string, detail: string): void {
    this.#messageService.add({ severity: 'success', summary, detail });
  }

  warning(summary: string, detail: string): void {
    this.#messageService.add({ severity: 'warn', summary, detail });
  }

  error(summary: string, detail: string): void {
    this.#messageService.add({ severity: 'error', summary, detail });
  }
}
