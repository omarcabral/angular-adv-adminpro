import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AdminGuard } from "../guards/admin.guard"
import { AuthGuard } from "../guards/auth.guard"
import { AccountSettingsComponent } from "./account-settings/account-settings.component"
import { BusquedaComponent } from "./busqueda/busqueda.component"
import { DashboardComponent } from "./dashboard/dashboard.component"
import { Grafica1Component } from "./grafica1/grafica1.component"
import { HospitalesComponent } from "./mantenimientos/hospitales/hospitales.component"
import { MedicoComponent } from "./mantenimientos/medicos/medico.component"
import { MedicosComponent } from "./mantenimientos/medicos/medicos.component"
import { UsuariosComponent } from "./mantenimientos/usuarios/usuarios.component"
import { PagesComponent } from "./pages.component"
import { PerfilComponent } from "./perfil/perfil.component"
import { ProgressComponent } from "./progress/progress.component"
import { PromesasComponent } from "./promesas/promesas.component"
import { RxjsComponent } from "./rxjs/rxjs.component"

const routes:Routes=[
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate:[AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data:{ titulo:'Dashboard'} },
      { path: 'progress', component: ProgressComponent, data:{titulo:'Progreso'} },
      { path: 'grafica1', component: Grafica1Component,  data:{titulo:'Gráfica 1'} },
      { path: 'promesas', component:PromesasComponent,  data:{titulo:'Promesas'}},
      { path: 'rxjs', component:RxjsComponent,  data:{titulo:'RXJS'}},
      { path: 'perfil', component:PerfilComponent,  data:{titulo:'Perfil de Usuario'}},
      { path: 'account-settings', component: AccountSettingsComponent,  data:{titulo:'Ajustes'} },
      { path: 'buscar/:termino', component: BusquedaComponent,  data:{titulo:'Busquedas'} },
      { path: '', redirectTo:'/dashboard', pathMatch:'full'},

      //mantenimientos
      { path: 'usuarios', canActivate:[AdminGuard], component:UsuariosComponent,  data:{titulo:'Mantenimiento de Usuarios'}},
      { path: 'hospitales', canActivate:[AdminGuard], component:HospitalesComponent,  data:{titulo:'Mantenimiento de Hospitales'}},
      { path: 'medicos', canActivate:[AdminGuard], component:MedicosComponent,  data:{titulo:'Mantenimiento de Medicos'}},
      { path: 'medico/:id', canActivate:[AdminGuard], component:MedicoComponent,  data:{titulo:'Mantenimiento de Medicos'}},
    ],
  },
]

@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[ RouterModule ]
})
export class PagesRoutingModule {}
