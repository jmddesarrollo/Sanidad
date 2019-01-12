import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';

import { ToastrService } from 'ngx-toastr';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
  providers: [UsuarioService]
})
export class UsuariosComponent implements OnInit {

  public usuarios: Usuario[];
  public countUsuarios: number;
  public loading: boolean;

  constructor(
    private _usuarioService: UsuarioService,
    private _modalUploadService: ModalUploadService,
    private _toastr: ToastrService
  ) {
    this.usuarios = [];
    this.loading = true;
   }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios() );
  }

  cargarUsuarios() {
    this.loading = true;
    this._usuarioService.cargarUsuarios().subscribe(
      response => {
        this.usuarios = response.usuarios;
        this.countUsuarios = this.usuarios.length;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this._toastr.error('Error al cargar datos de los usuarios.');
      }
    );
  }

  buscarUsuarios(termino: string) {
    if (termino.length <= 0 ) {
      this.cargarUsuarios();
      return false;
    }

    this.loading = true;
    this._usuarioService.buscarUsuarios(termino).subscribe(
      response => {
        this.usuarios = response.usuarios;
        this.loading = false;
      },
      error => {
        this._toastr.error('Error al cargar datos de los usuarios.');
        this.loading = false;
      }
    );
  }

  borrarUsuario(usuario) {
    if (usuario._id === this._usuarioService.usuario._id) {
      this._toastr.success('Un usuario no puede eliminarse a si mismo.');
      return false;
    }

    if (confirm('¿Desea eliminar al usuario ' + usuario.nombre + '?')) {
      this._usuarioService.borrarUsuario(usuario).subscribe(
        response => {
          this._toastr.success('Usuario eliminado correctamente.');
          this.cargarUsuarios();
        },
        error => {
          this._toastr.error('Ha ocurrido un error al intentar eliminar el usuario.');
        }
      );
    }
  }

  editarUsuario(usuario) {
    this._usuarioService.actualizarUsuario(usuario).subscribe(
      response => {
        this._toastr.success('Usuario actualizado correctamente.');
        this.cargarUsuarios();
      },
      error => {
        this._toastr.error('Ha ocurrido un error al intentar actualizar el usuario.');
      }
    );

  }

  mostrarModal(idUsuario) {
    this._modalUploadService.mostrarModal('usuarios', idUsuario);
  }

}
