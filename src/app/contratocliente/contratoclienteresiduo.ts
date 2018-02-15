export interface ContratoClienteResiduoFilter {
  id: string;
  cliente: string;
  descricao: string;
  vigencia_inicio: string;
  vigencia_final: string;
}
export class ContratoClienteResiduo {
  constructor(
    public id: number = null,
    public id_contrato_cliente: number = null,
    public id_contrato_fornecedor: number = null,
    public id_servico: number = null,
    public id_residuo: number = null,
    public unidade: string = '',
    public preco_compra: number = 0,
    public preco_servico: number = 0,
    public created_at: string = '',
    public updated_at: string = '',
    public fornecedor: string = '',
    public residuo: string = '',
    public servico: string = '',
  ) {}
}
