export interface ClasseResiduoFilter {
  id: string;
  descricao: string;
}
export class ClasseResiduo {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
