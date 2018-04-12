export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public id_perfil: string,
    public created_at: Date,
    public updated_at: Date
  ) {}
}
