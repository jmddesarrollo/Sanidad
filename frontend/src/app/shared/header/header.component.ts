import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
  providers: [UsuarioService]
})
export class HeaderComponent implements OnInit {
  public usuario: Usuario;

  constructor(
    public _usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.usuario = JSON.parse( localStorage.getItem('usuario'));
  }

  buscar(termino: string) {
    this.router.navigate(['/busqueda', termino]);
  }

}
