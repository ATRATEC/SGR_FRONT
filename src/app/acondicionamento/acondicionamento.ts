export interface AcondicionamentoFilter {
  id: string;
  descricao: string;
}
export class Acondicionamento {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
