export interface TipoTratamentoFilter {
  id: string;
  descricao: string;
}
export class TipoTratamento {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
