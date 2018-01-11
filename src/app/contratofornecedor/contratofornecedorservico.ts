import { Servico } from './../servico/servico';
import { Fornecedor } from './../fornecedor/fornecedor';
import { ContratoFornecedor } from './contratofornecedor';

export interface ContratoFornecedorServicoFilter {
  id: string;
  fornecedor: string;
  servico: string;
}
export class ContratoFornecedorServico {
  constructor(
    public id: number = null,
    public id_contrato: number = null,
    public id_fornecedor: number = null,
    public id_servico: null = null,
    public preco: number = null,
    public selecionado: boolean = false,
    public created_at: string = '',
    public updated_at: string = '',
    public contrato_fornecedor: ContratoFornecedor = null,
    public fornecedor: Fornecedor = null,
    public servico: Servico = null
  ) {}
}
