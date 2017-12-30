export interface TipoAtividadeFilter {
  id: string;
  descricao: string;
}
export class TipoAtividade {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
