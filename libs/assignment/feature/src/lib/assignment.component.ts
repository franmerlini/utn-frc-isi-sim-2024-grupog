import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gg-assignment',
  standalone: true,
  imports: [],
  template: `<h1>Acá va el enunciado del TP</h1>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentComponent {}
