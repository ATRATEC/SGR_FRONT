import { ContratoFornecedorFilter } from './contratofornecedor';
export interface ContratoFornecedorServicoGridFilter {
  id: string;
  cliente: string;
  id_cliente: number;
  fornecedor: string;
  descricao: string;
  id_tipo_atividade: number;
  vigencia_inicio: string;
  vigencia_final: string;
}

export interface ContratoFornecedorServicoFilter {
  id: number;
  id_cliente: number;
  id_contrato: number;
  id_servico: number;
  unidade: string;
}

export class ContratoFornecedorServicoFiltro implements ContratoFornecedorServicoFilter {
  constructor(
    public id: number = null,
    public id_cliente: number = null,
    public id_contrato: number = null,
    public id_servico: number = null,
    public unidade: string = '',
  ) {}
}

export class ContratoFornecedorServico {
  constructor(
    public id: number = null,
    public id_contrato: number = null,
    public id_fornecedor: number = null,
    public id_servico: number = null,
    public preco_compra: number = null,
    public preco_servico: number = null,
    public selecionado: boolean = false,
    public created_at: string = '',
    public updated_at: string = '',
    public servico: string = '',
    public fornecedor: string = ''
  ) {}
}
