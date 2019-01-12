import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ModalUploadService {
  public tipo: string;
  public id: string;

  // Variable que se usa en css para mostrar u ocultar modal.
  public oculto: string;

  public notificacion = new EventEmitter<any>();

  constructor() {
    this.oculto = 'oculto';
  }

  ocultarModal() {
    this.oculto = 'oculto';
    this.tipo = null;
    this.id = null;
  }

  mostrarModal(tipo: string, id: string) {
    this.oculto = null;
    this.id = id;
    this.tipo = tipo;
  }

}
