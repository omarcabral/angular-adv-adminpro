export class Usuario{
  constructor(
    public nombre: String,
    public email:String,
    public apellido: String,
    public password?:String,
    public img?: String,
    public uid?:String,
    public role?: String,
    public google?: Boolean
  ){

  }
}
