export interface ResiduoFilter {
  id: string;
  codigo: string;
  descricao: string;
}
export class Residuo {
  constructor(
    public id: number,
    public codigo: number,
    public descricao: string,
    public id_classe: number,
    public descricao_classe: string,
    public created_at: string,
    public updated_at: string
  ) {}
}
