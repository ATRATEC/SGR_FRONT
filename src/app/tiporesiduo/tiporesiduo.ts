export interface TipoResiduoFilter {
  id: string;
  descricao: string;
}
export class TipoResiduo {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
