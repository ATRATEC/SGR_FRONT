import { Fornecedor } from './../fornecedor/fornecedor';
import { Cliente } from './../cliente/cliente';
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
    public vigencia_inicio: Date = null,
    public vigencia_final: Date = null,
    public exclusivo: boolean = false,
    public caminho: string = '',
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = '',
    public cliente: Cliente = null,
    public fornecedor: Fornecedor = null
  ) {}
}
