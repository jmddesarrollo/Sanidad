import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Modulo de notificaciones.
import { ToastrService } from 'ngx-toastr';

import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UsuarioService, ToastrService]
})
export class RegisterComponent implements OnInit {

  public forma: FormGroup;
  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl(null, [Validators.required, Validators.max(30), Validators.min(3)]),
      correo: new FormControl(null, [Validators.required]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, { validators: this.sonIguales('password', 'password2') });

    this.forma.setValue({
      nombre: 'Test',
      correo: 'jmd@gmail.com',
      password: '123qwe',
      password2: '123qwe',
      condiciones: false
    });
  }

  sonIguales(str1: string, str2: string) {
    return (group: FormGroup) => {
      const strVal1 = group.controls[str1].value;
      const strVal2 = group.controls[str2].value;
      if (strVal1 === strVal2) {
        return null;
      }

      return {sonIguales: true};
    };
  }

  registrarUsuario() {
    if (this.forma.invalid) {
      return false;
    }

    if (!this.forma.value.condiciones) {
      this._toastr.warning('Debe de aceptar las condiciones si quiere registrarse.');
      return false;
    }
    // console.log(this.forma.value);
    // console.log(this.forma.valid);

    const usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    this._usuarioService.crearUsuario(usuario).subscribe(
      response => {
        this._toastr.success('Usuario creado correctamente.');
        this._router.navigate(['/login']);
      },
      error => {
        this._toastr.error('Ha ocurrido un error en el alta de usuario');
      }
    );
  }

}
