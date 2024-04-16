# UTN - FRC - ISI - SIM - Grupo G

Este proyecto contiene todos los trabajos prácticos desarrollados durante el cursado de la asignatura Simulación. En las secciones posteriores se explica cómo ejecutar el proyecto en local.

## Integrantes

| Legajo | Apellido y nombre                           |
| ------ | ------------------------------------------- |
| 68719  | Albarracin, Gonzalo                         |
| 81907  | Amormino, Julieta                           |
| 72165  | Del Valle Álvarez Achaval, Carolina Soledad |
| 79708  | Fasoletti, Candelaria                       |
| 81211  | Merlini Bravo, Francisco                    |
| 77523  | Talavera, Azul                              |
| 75865  | Vela Rodriguez, Mariel Azul                 |

## Instalaciones necesarias

- [Git](https://git-scm.com/downloads)
- [NodeJS](https://nodejs.org/en/download)

## Instrucciones para ejecutar el proyecto en local

1. Clonar este repositorio. Para ello abrir una terminal en la carpeta donde desee ser clonado y ejecutar el comando:

   ```sh
     git clone https://github.com/franmerlini/utn-frc-isi-sim-2024-grupog.git
   ```

2. Una vez clonado el repositorio, ubicarse en la carpeta raíz del proyecto. Para ello, sobre la misma terminal ejecutar el comando:
   ```sh
   cd utn-frc-isi-sim-2024-grupog
   ```
3. Instalar las dependencias con el comando:
   ```sh
   npm i
   ```
4. Una vez terminadas las instalaciones, crear un servidor local. Para ello utilizar el comando:
   ```sh
   npx nx serve <app_name>
   ```
   donde <app_name> es el nombre de la aplicación que se quiere ejecutar. Valores válidos: `tp2`, `tp3`, `tp4` o `tp5`.
