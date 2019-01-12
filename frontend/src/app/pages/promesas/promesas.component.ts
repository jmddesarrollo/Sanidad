import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {

    this.contarTres()
      .then( respuesta => {
        console.log('Resolver. ', respuesta);
      })
      .catch( error => {
        console.error(error);
      });
  }

  ngOnInit() {
  }

  contarTres(): Promise<string> {
    return new Promise((resolve, reject) => {
      let contador = 0;
      const intervalo = setInterval(() => {
        contador += 1;
        console.log(contador);
        if (contador === 3) {
          resolve('Ok!');

          // Para parar el intervalo.
          clearInterval(intervalo);
        }
        if (contador > 3) {
          // Para enviar un error controlado.
          reject('Error controlado');
        }
      }, 1000);
    });
  }

}
