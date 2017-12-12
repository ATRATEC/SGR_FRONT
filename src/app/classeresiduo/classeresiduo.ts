export interface ClasseResiduoFilter {
  id: string;
  codigo: string;
  descricao: string;
}
export class ClasseResiduo {
  constructor(
    public id: number,
    public codigo: number,
    public descricao: string,
    public created_at: string,
    public updated_at: string
  ) {}
}
