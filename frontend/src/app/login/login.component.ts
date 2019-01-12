import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

// Modulo de notificaciones.
import { ToastrService } from 'ngx-toastr';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UsuarioService, ToastrService]
})
export class LoginComponent implements OnInit {
  public recuerdame: boolean;
  public email: string;

  constructor(
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _toastr: ToastrService
  ) {
    this.recuerdame = false;
  }

  ngOnInit() {
    init_plugins();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  ingresar(forma: NgForm) {
    // console.log(forma.valid);
    // console.log(forma.value);
    const usuario = new Usuario(null, forma.value.email, forma.value.password);

    this._usuarioService.login(usuario).subscribe(
      response => {
        localStorage.setItem('id', response.usuario._id);
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify(response.usuario));

        if (this.recuerdame) {
          localStorage.setItem('email', response.usuario.email);
        } else {
          localStorage.removeItem('email');
        }

        this._toastr.success('Login realizado correctamente.');
        this._router.navigate(['/dashboard']);
      }, error => {
        const errorMensaje = JSON.parse(error._body);
        if (errorMensaje.mensaje !== undefined) {
          this._toastr.error(errorMensaje.mensaje);
        } else {
          this._toastr.error('Ha ocurrido un error en el alta de usuario');
        }
      }
    );
  }
}
