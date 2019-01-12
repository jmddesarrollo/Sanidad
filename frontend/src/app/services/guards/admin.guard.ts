import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private _usuarioService: UsuarioService,
    private router: Router
  ) {

  }
  canActivate() {
    if (this._usuarioService.usuario.rol === 'ADMIN_ROLE') {
      console.log('Permiso concedido');
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      console.log('Bloqueado por el ADMIN GUARD');
      return false;
    }
  }
}
