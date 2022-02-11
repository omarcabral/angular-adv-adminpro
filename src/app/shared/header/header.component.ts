import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit  {
  public usuario:Usuario= new Usuario('','','', 'USER_ROLE');
  constructor(private usuarioService:UsuarioService, private router:Router) {
    this.usuario=this.usuarioService.usuario||new Usuario('', '', '', 'USER_ROLE');
  }
  ngOnInit(): void {

  }
  logout(){
    this.usuarioService.logout();
  }
  buscar(termino:string){
    if (termino.length===0)
    {
      this.router.navigateByUrl(`/dashboard`);
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }
}
