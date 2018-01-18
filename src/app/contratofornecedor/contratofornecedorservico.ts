export interface ContratoFornecedorServicoFilter {
  id: string;
  fornecedor: string;
  descricao: string;
  vigencia_inicio: string;
  vigencia_final: string;
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
    public descricao: string = '',
  ) {}
}
