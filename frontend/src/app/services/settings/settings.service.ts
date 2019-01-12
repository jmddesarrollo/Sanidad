import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class SettingsService {

ajustes: Ajustes = {
  temaUrl: 'assets/css/colors/default.css',
  tema: 'default'
};

  constructor(@Inject(DOCUMENT) private _document) {
    this.cargarAjustes();
  }

  cargarAjustes() {
    if (localStorage.getItem('ajustes')) {
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
    }
    this.aplicarTema(this.ajustes.tema);
  }

  aplicarTema(tema: string) {
    const url = 'assets/css/colors/' + tema + '.css';
    this._document.getElementById('link_tema').setAttribute('href', url);

    this.ajustes.temaUrl = url;
    this.ajustes.tema = tema;

    this.guardarAjustes();
  }

  guardarAjustes() {
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }
}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
