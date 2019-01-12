import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { map, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscriptionName: Subscription;

  constructor() {

    // Subscribirse al Observable
    this.subscriptionName = this.regresaObservable().subscribe(
      numero => {
        console.log('Subs: ', numero);
      },
      error => {
        console.error('Error en el Observable ', error);
      },
      () => {
        console.log('El observador termino!');
      }
    );
   }

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('La página se va a cerrar');
    this.subscriptionName.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    const obs = new Observable( (observer: Subscriber<any>) => {
      let contador = 0;
      const intervalo = setInterval( () => {
        contador += 1;
        const objeto = {valor: contador};
        observer.next(objeto);

        if (contador === 5) {
          clearInterval(intervalo);
          observer.complete();
        }

        if (contador === 7) {
          clearInterval(intervalo);
          observer.error('Error detectado.');
        }
      }, 1000);
    }).pipe(
      map(resp => {
        // Transforma la información en formato que se quiere obtener de salida.
        return resp.valor;
      }),
      // Filter recibe dos argumentos: valor de respuesta y index que indica las veces que se ha llamado el filter.
      // Devuelve true/false para indicar si ese valor interesa como salida o no debe salir.
      filter( (valor, index) => {
        // Realiza filtro de salida.
        // console.log('Filter: ', valor, index);

        if ( (valor % 2) === 1) {
          // impar
          return true;
        } else {
          // par
          return false;
        }
        // return true;
      })
    ).pipe(
      // Reintenta 2 veces, además de la ejecución normal, después de errar.
      retry(2)
    );

    return obs;
  }

}
