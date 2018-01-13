import { Moment } from 'moment/moment';

export interface ContratoFornecedorFilter {
  id: string;
  cliente: string;
  fornecedor: string;
  descricao: string;
  vigencia_inicio: string;
  vigencia_final: string;
}
export class ContratoFornecedor {
  constructor(
    public id: number = null,
    public id_cliente: number = null,
    public id_fornecedor: number = null,
    public descricao: string = '',
    public vigencia_inicio: Date = null,
    public vigencia_final: Date = null,
    public exclusico: boolean = false,
    public observacao: string = '',
    public caminho: string = '',
    public created_at: string = '',
    public updated_at: string = '',
    public fornecedor: string = '',
    public cliente: string = ''
  ) {}
}
