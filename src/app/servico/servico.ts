export interface ServicoFilter {
  id: string;
  descricao: string;
  tipo_atividade: string;
}
export class Servico {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public id_tipo_atividade: number = null,
    public created_at: string = '',
    public updated_at: string = '',
    public tipo_atividade: string = ''
  ) {}
}
