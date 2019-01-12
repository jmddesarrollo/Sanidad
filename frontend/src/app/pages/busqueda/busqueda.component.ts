import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  public termino: string;

  constructor(
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.route.params.forEach(param => {
      this.termino = param['termino'];
      console.log(this.termino);
    });
  }

  busquedaGlobal(termino: string) {
    // Realizar servicio de búsqueda global.
  }

}
