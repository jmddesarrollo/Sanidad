import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { UploadService } from '../../services/service.index';
import { Subscriber } from 'rxjs/Subscriber';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [],
  providers: [UploadService]
})
export class ModalUploadComponent implements OnInit {
  public imagenSubir: File;
  public imagenTemp: string;

  constructor(
    private _uploadService: UploadService,
    public _modalUploadService: ModalUploadService,
    private _toastr: ToastrService
  ) {
    this.imagenTemp = null;
   }

  ngOnInit() {
  }

  seleccionImagen(archivo) {
    if (archivo) {
      this.imagenSubir = archivo;
    } else {
      this.imagenSubir = null;
    }
    // console.log(archivo);
    if (archivo.type.indexOf('image') < 0) {
      this._toastr.error('El archivo seleccionado no se reconoce como una imagen.');
      this.imagenTemp = null;
      return false;
    }

    // JavaScript nativo.
    // Previsualizar la imagen seleccionada.
    const reader = new FileReader();
    reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result;
      // Imagen en Base 64.
      // console.log(reader.result);
  }

  subirImagen() {
    this._uploadService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
      .then(result => {
        this._toastr.success('El archivo se ha cargado satisfactorialmente.');

        this._modalUploadService.notificacion.emit( result );
        this.cerrarModal();
      })
      .catch(error => {
        this._toastr.error('Error en la carga de imagen.');
      });
  }

  cerrarModal() {
    this.imagenTemp = '';
    this.imagenSubir = null;

    this._modalUploadService.ocultarModal();
  }
}
