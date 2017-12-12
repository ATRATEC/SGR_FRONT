export interface AcondicionamentoFilter {
  id: string;
  codigo: string;
  descricao: string;
}
export class Acondicionamento {
  constructor(
    public id: number,
    public codigo: number,
    public descricao: string,
    public created_at: string,
    public updated_at: string
  ) {}
}
