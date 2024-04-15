import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gg-assignment',
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold underline">Enunciado</h1>

      <p class="text-justify">
        Crear un aplicativo que genere una serie de números aleatorios (4 dígitos decimales) de variables aleatorias
        para las siguientes distribuciones:
      </p>

      <ul class="list-disc pl-8">
        <li>Uniforme [a, b]</li>
        <li>Exponencial (lambda)</li>
        <li>Normal (media y desviación)</li>
      </ul>

      <p class="text-justify">
        Para generar los números aleatorios uniforme entre 0 y 1 utilizar la función nativa del lenguaje.
      </p>

      <p class="text-justify">
        El usuario deberá poder ingresar el tamaño de muestra deseado N (hasta 1.000.000), y los parámetros que son
        requeridos según la distribución seleccionada. La serie de números generados se debe poder visualizar.
      </p>

      <p class="text-justify">
        Sobre esta serie generada se debe realizar y mostrar el histograma de frecuencias para 10, 12, 16 ó 23
        intervalos (a seleccionar) donde se muestren las frecuencias. Graficar el histograma con los rótulos debidos en
        cada eje.
      </p>

      <p class="text-justify">
        Realizar las pruebas de bondad de Chi-Cuadrado y Kolmogorov-Smirnov, sobre la serie generada y determinar si se
        acepta la hipótesis nula.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentComponent {}
