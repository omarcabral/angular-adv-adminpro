import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit  {
  public usuario:Usuario= new Usuario('','','');
  constructor(private usuarioService:UsuarioService) {
    this.usuario=this.usuarioService.usuario||new Usuario('', '', '');
  }
  ngOnInit(): void {

  }
  logout(){
    this.usuarioService.logout();
  }

}
