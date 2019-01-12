import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Usuario } from '../../models/usuario.model';

import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioService {
  public token: string;
  public usuario: Usuario;

  constructor(
    private _http: Http,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token') || '';
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  }

  estalogueado() {
    return (this.token.length > 5) ? true : false;
  }

  login(usuario: Usuario) {
    const params = JSON.stringify(usuario);
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const url = URL_SERVICIOS + '/login';

    return this._http.post(url, params, {headers: headers}).map(res => res.json());
  }

  logout() {
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('usuario');

    this._router.navigate(['/login']);
  }

  crearUsuario(usuario: Usuario) {
    const params = JSON.stringify(usuario);
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const url = URL_SERVICIOS + '/usuario';

    return this._http.post(url, params, {headers: headers}).map(res => res.json());
  }

  actualizarUsuario(usuario: Usuario) {
    const params = JSON.stringify(usuario);
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const url = URL_SERVICIOS + '/usuario/' + usuario._id + '/?token=' + this.token;

    return this._http.put(url, params, {headers: headers}).map(res => res.json());
  }

  borrarUsuario(usuario: Usuario) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const url = URL_SERVICIOS + '/usuario/' + usuario._id + '/?token=' + this.token;

    return this._http.delete(url, options).map(res => res.json());
  }

  cargarUsuarios() {
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const url = URL_SERVICIOS + '/usuario';

    return this._http.get(url, {headers: headers}).map(res => res.json());
  }

  buscarUsuarios(termino: string) {
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this._http.get(url, {headers: headers}).map(res => res.json());
  }

}
