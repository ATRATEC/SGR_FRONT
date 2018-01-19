import { ContratoFornecedorFilter } from './contratofornecedor';
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
    public unidade: string = '',
    public preco_compra: number = null,
    public preco_servico: number = null,
    public selecionado: boolean = false,
    public created_at: string = '',
    public updated_at: string = '',
    public servico: string = '',
    public fornecedor: string = ''
  ) {}
}
