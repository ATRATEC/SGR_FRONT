export interface ProdutoFilter {
  id: string;
  codigo: string;
  descricao: string;
}
export class Produto {
  constructor(
    public id: number,
    public codigo_produto: number,
    public codigo_produto_integracao: string,
    public codigo: string,
    public descricao: string,
    public ean: string,
    public ncm: string,
    public quantidade_estoque: number,
    public csosn_icms: string,
    public unidade: string,
    public valor_unitario: number,
    public cst_icms: string,
    public aliquota_icms: string,
    public red_base_icms: number,
    public aliquota_ibpt: number,
    public tipoItem: string,
    public cst_pis: string,
    public aliquota_pis: number,
    public cst_cofins: string,
    public aliquota_cofins: number,
    public bloqueado: string,
    public importado_api: string,
    public id_familia: string,
    public codigo_familia: number,
    public codInt_familia: string,
    public descricao_familia: string,
    public inativo: string,
    public id_dadosIbpt: number,
    public cest: string,
    public cfop: string,
    public peso_liq: number,
    public peso_bruto: number,
    public estoque_minimo: number,
    public descr_detalhada: string,
    public obs_internas: string,
    public inclusao: Date,
    public usuario_inclusao: string,
    public alteracao: Date,
    public usuario_alteracao: string,
    public sincronizar: string
  ) {}
}
