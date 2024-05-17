import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gg-assignment',
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold underline">Enunciado</h1>

      <p class="text-justify">
        Un vendedor de periódicos trata de maximizar sus ganancias. El número de periódicos que vende cada día es una
        variable aleatoria. Sin embargo, el análisis de los datos del mes pasado muestra la distribución de la demanda
        diaria que figura a continuación:
      </p>

      <div class="flex justify-center">
        <table class="table">
          <thead>
            <th>Demanda</th>
            <th>Probabilidad</th>
          </thead>

          <tbody>
            <tr>
              <td>30</td>
              <td>0.05</td>
            </tr>
            <tr>
              <td>31</td>
              <td>0.15</td>
            </tr>
            <tr>
              <td>32</td>
              <td>0.22</td>
            </tr>
            <tr>
              <td>33</td>
              <td>0.38</td>
            </tr>
            <tr>
              <td>34</td>
              <td>0.05</td>
            </tr>
            <tr>
              <td>35</td>
              <td>0.14</td>
            </tr>
            <tr>
              <td>36</td>
              <td>0.06</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-justify">
        Cada periódico le cuesta $1.00 al vendedor y lo vende a $1.20. Los periódicos que no vende los devuelve a la
        editorial y recibe $0.40 por cada uno. Para toda la demanda no satisfecha se estima un costo de $0.60 en
        clientela y ganancia perdida.
      </p>

      <p class="text-justify">
        Si la política es pedir una cantidad igual a la demanda del día anterior, determíne la ganancia diaria promedio
        del vendedor mediante la simulación del sistema para un período de 120 días. Suponga que la demanda para el día
        0 es de 22 periódicos.
      </p>

      <p class="text-justify">¿Cuál será su ganancia diaria promedio?</p>
    </div>
  `,
  styles: [
    `
      th,
      td {
        padding-inline: 0.5rem;
        text-align: center;
        border: 1px solid;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentComponent {}
