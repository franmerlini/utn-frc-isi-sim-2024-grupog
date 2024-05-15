import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardModule } from 'primeng/card';

import { MembersTableComponent } from '@grupog/libs/home/ui/members-table';

type Member = {
  id: number;
  name: string;
};

@Component({
  selector: 'gg-home',
  standalone: true,
  imports: [MembersTableComponent, CardModule, DatePipe],
  template: `
    <div class="flex flex-col items-center gap-6">
      <div class="flex flex-col items-center gap-2">
        <span>Universidad Tecnológica Nacional</span>
        <span>Facultad Regional Córdoba</span>
        <span>Ingeniería en Sistemas de Información</span>
      </div>

      <span>Cátedra de Simulación</span>

      <span><b>Curso</b>: 4K2</span>

      <span class="text-center">{{ theme() }}</span>

      <span><b>Grupo</b>: G</span>

      <div class="flex flex-col items-center gap-2">
        <span><b>Integrantes</b>:</span>
        <gg-members-table [members]="members" />
      </div>

      <span><b>Fecha de presentación</b>: {{ dueDate() | date : 'dd/MM/yyyy' }}</span>
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  theme = input.required<string>();
  dueDate = input.required<Date>();

  members: Member[] = [
    {
      id: 68719,
      name: 'Albarracin, Gonzalo',
    },
    {
      id: 81907,
      name: 'Amormino, Julieta',
    },
    {
      id: 72165,
      name: 'Alvarez Achaval, Carolina Soledad del Valle',
    },
    {
      id: 79708,
      name: 'Fasoletti, Candelaria',
    },
    {
      id: 81211,
      name: 'Merlini Bravo, Francisco',
    },
    {
      id: 77523,
      name: 'Talavera, Azul',
    },
    {
      id: 75865,
      name: 'Vela Rodriguez, Mariel Azul',
    },
  ];
}
