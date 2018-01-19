import { Moment } from 'moment/moment';

export interface ContratoClienteFilter {
  id: string;
  cliente: string;
  descricao: string;
  vigencia_inicio: string;
  vigencia_final: string;
}
export class ContratoCliente {
  constructor(
    public id: number = null,
    public id_cliente: number = null,
    public descricao: string = '',
    public vigencia_inicio: Date = null,
    public vigencia_final: Date = null,
    public exclusico: boolean = false,
    public observacao: string = '',
    public caminho: string = '',
    public created_at: string = '',
    public updated_at: string = '',
    public cliente: string = ''
  ) {}
}
