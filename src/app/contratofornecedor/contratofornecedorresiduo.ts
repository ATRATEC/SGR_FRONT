export interface ContratoFornecedorResiduoFilter {
  id: number;
  id_contrato: number;
  id_fornecedor: number;
  id_residuo: number;
  unidade: string;
}

export class ContratoFornecedorResiduo {
  constructor(
    public id: number = null,
    public id_contrato: number = null,
    public id_fornecedor: number = null,
    public id_residuo: number = null,
    public unidade: string = '',
    public preco_venda: number = null,
    public preco_servico: number = null,
    public created_at: string = '',
    public updated_at: string = '',
    public residuo: string = '',
    public fornecedor: string = ''
  ) {}
}
