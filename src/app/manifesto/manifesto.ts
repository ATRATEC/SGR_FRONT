import { Moment } from 'moment/moment';

export interface ManifestoFilter {
  id: string;
  cliente: string;
  numero: string;
  data: string;
  contrato: string;
}
export class Manifesto {
  constructor(
    public id: number = null,
    public id_cliente: number = null,
    public id_contrato_cliente: number = null,
    public data: Date = null,
    public numero: string = '',
    public observacao: string =  '',
    public caminho: string = '',
    public created_at: string = '',
    public updated_at: string = '',
    public cliente: string = '',
    public descricao: string = ''
  ) {}
}
