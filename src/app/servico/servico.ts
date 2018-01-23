export interface ServicoFilter {
  id: string;
  descricao: string;
}
export class Servico {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public armazenador: boolean = false,
    public destinador: boolean = false,
    public transportador: boolean = false,
    public outras: boolean = true,
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
