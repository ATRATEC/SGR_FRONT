import { Moment } from 'moment/moment';

export interface PesagemFilter {
  id: string;
  cliente: string;
  data: string;
  descricao: string;
}
export class Pesagem {
  constructor(
    public id: number = null,
    public id_cliente: number = null,
    public id_contrato_cliente: number = null,
    public data: Date = null,
    public observacao: string =  '',
    public created_at: string = '',
    public updated_at: string = '',
    public cliente: string = '',
    public descricao: string = ''
  ) {}
}
