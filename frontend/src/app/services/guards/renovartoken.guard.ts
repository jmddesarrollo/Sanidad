import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class RenovartokenGuard implements CanActivate {
  constructor(
    private _usuarioService: UsuarioService,
    private router: Router
  ) {

  }

  // Descifrar token para recoger fecha de expiración.
  canActivate(): Promise<boolean> | boolean {
    console.log('Inicio de token guard');
    const token = this._usuarioService.token;
    // atob: Decodifica una cadena de datos que viene en base64.
    const payload = JSON.parse( atob( token.split('.')[1] ));

    console.log(payload);

    const expirado = this.qExpirado(payload.exp);

    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  qExpirado(fechaExp: number): boolean {
    const ahora = new Date().getTime() / 1000;
    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const tokenExp = new Date(fechaExp * 1000);
      const ahora = new Date();
      // El momento de ahora le suma 1h pq el Time devuelve milisegundos, y token trabaja en segundos.
      ahora.setTime(ahora.getTime() + ( 1 * 60 * 60 * 1000 ));

      if ( tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        // Cuando el token tiene una hora para expirar se revueva.
        this._usuarioService.renovartoken().subscribe( () => {
          resolve(true);
        }, () => {
          this.router.navigate(['/login']);
          reject(false);
        });
      }

      resolve(true);
    });
  }
}
