export interface ResiduoFilter {
  id: string;
  descricao: string;
}
export class Residuo {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public id_classe: number = null,
    public descricao_classe: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
