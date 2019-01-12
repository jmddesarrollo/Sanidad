import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService, UploadService } from '../../services/service.index';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [],
  providers: [UploadService]
})
export class ProfileComponent implements OnInit {
  public usuario: Usuario;
  public imagenSubir: File;
  public imagenTemp: string;

  constructor(
    private _usuarioService: UsuarioService,
    private _uploadService: UploadService,
    private _toastr: ToastrService
  ) {
    this.imagenTemp = null;
   }

  ngOnInit() {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.usuario = new Usuario(null, null, null, null, null, null);
    }
  }

  guardar(usuario: Usuario) {
    this.usuario.nombre = usuario.nombre;
    this.usuario.email = usuario.email;

    this._usuarioService.actualizarUsuario(this.usuario).subscribe(
      response => {
        localStorage.setItem('usuario', JSON.stringify(response.usuarioUpdated));

        this._toastr.success('Usuario actualizado correctamente');
      },
      error => {
        this._toastr.error('Error al actualizar usuario');
      }
    );
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

  cambiarImagen() {
    this._uploadService.subirArchivo(this.imagenSubir, 'usuarios', this.usuario._id)
      .then((response: any) => {
        this.usuario.img = response.usuario.img;
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        this._toastr.success('Imagen actualizada correctamente');
      })
      .catch(error => {
        this._toastr.error('Error al subir imagen.');
      });
    }
}
