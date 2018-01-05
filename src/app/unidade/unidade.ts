export interface UnidadeFilter {
  id: string;
  codigo: string;
  descricao: string;
}
export class Unidade {
  constructor(
    public id: number = null,
    public codigo: string = '',
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
