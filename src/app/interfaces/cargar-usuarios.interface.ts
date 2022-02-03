import { Usuario } from "../models/usuario.model";

export interface CargarUsuario{
  totalRegistros:number;
  usuarios:Usuario[];
}
