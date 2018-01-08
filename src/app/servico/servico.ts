export interface ServicoFilter {
  id: string;
  descricao: string;
}
export class Servico {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
