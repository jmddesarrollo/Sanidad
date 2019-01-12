import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class LoginGuardGuard implements CanActivate {
  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router
  ) {}

  canActivate() {
    if (this._usuarioService.estalogueado()) {
      return true;
    } else {
      console.log('Bloqueado por el login Guard');
      this._router.navigate(['/login']);
      return false;
    }
  }
}
