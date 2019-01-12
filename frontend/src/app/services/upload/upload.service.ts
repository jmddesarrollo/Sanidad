import { Injectable } from '@angular/core';

import { URL_SERVICIOS } from '../../config/config';

@Injectable()
export class UploadService {

  constructor() { }

  // Petición para subir un archivo
  subirArchivo(archivo: File, tipo: string, id: string) {
    // Lanzar el código de la subida a través de una promesa
    return new Promise(function (resolve, reject) {
      // Simular comportamiento de un formulario
      const formData = new FormData();
      // Petición de ajax tipica
      const xhr = new XMLHttpRequest();

      // Añadir archivo al formulario simulado
      // El literal 'archivo' es el nombre que espera el backend pq así los hemos definido.
      formData.append('archivo', archivo, archivo.name);

      // Configurar la petición data.
      xhr.onreadystatechange = function () {
        // Cuando termine el proceso.
        if (xhr.readyState === 4) {
          // Si la operación se realizó correctamente.
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;

      // true: asincrona.
      xhr.open('PUT', url, true);
      // xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }

}
