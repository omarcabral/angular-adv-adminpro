import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }
  menu:any[]=[{
    titulo:'Dashboard',
    icono:'mdi mdi-gauge',
    submenu:[
      { titulo:'Main',  url:'/'},
      { titulo:'Progress Bar', url:'progress'},
      { titulo: 'Gráficas', url:'grafica1'},
      { titulo: 'Promesas', url:'promesas'},
      { titulo: 'Rxjs', url:'rxjs'},
    ]
  },
  {
    titulo:'Mantenimientos',
    icono:'mdi mdi-folder-lock-open',
    submenu:[
      { titulo:'Usuarios',  url:'usuarios'},
      { titulo:'Hospitales', url:'hospitales'},
      { titulo: 'Médicos', url:'medicos'},
    ]
  },
]
}
