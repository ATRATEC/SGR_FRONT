import { Moment } from 'moment/moment';

export interface ManifestoFilter {
  id: string;
  cliente: string;
  numero: string;
  data: string;
  contrato: string;
  transportador: string;
  destinador: string;
}
export class Manifesto {
  constructor(
    public id: number = null,
    public id_cliente: number = null,
    public id_contrato_cliente: number = null,
    public id_transportador: number = null,
    public id_destinador: number = null,
    public data: Date = null,
    public numero: string = '',
    public observacao: string =  '',
    public caminho: string = '',
    public created_at: string = '',
    public updated_at: string = '',
    public cliente: string = '',
    public descricao: string = '',
    public transportador: string = '',
    public destinador: string = ''
  ) {}
}
