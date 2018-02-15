export interface ContratoFornecedorResiduoFilter {
  id: number;
  id_contrato: number;
  id_fornecedor: number;
  id_residuo: number;
  id_servico: number;
  unidade: string;
  id_cliente: number;
  vigencia_inicio: Date;
  vigencia_final: Date;
}

export class ContratoFornecedorResiduoFiltro implements ContratoFornecedorResiduoFilter {
  constructor(
    public id: number = null,
    public id_contrato: number = null,
    public id_fornecedor: number = null,
    public id_residuo: number = null,
    public id_servico: number = null,
    public unidade: string = '',
    public id_cliente: number = null,
    public vigencia_inicio: Date = null,
    public vigencia_final: Date = null
  ) {}
}

export class ContratoFornecedorResiduo {
  constructor(
    public id: number = null,
    public id_contrato: number = null,
    public id_fornecedor: number = null,
    public id_residuo: number = null,
    public id_servico: number = null,
    public unidade: string = '',
    public preco_venda: number = 0,
    public preco_servico: number = 0,
    public created_at: string = '',
    public updated_at: string = '',
    public fornecedor: string = '',
    public residuo: string = '',
    public servico: string = ''
  ) {}
}
