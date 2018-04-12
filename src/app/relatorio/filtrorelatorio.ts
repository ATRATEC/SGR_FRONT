export interface FiltroRelatorioFilter {
  id: string;
  descricao: string;
  tipo_atividade: string;
}
export class FiltroRelatorio {
  constructor(
    public id: number = null,
    public id_cliente: number = null,
    public cliente: string = '',
    public id_fornecedor: number = null,
    public fornecedor: string = '',
    public receita: boolean = true,
    public receita_analitico = true,
    public receita_sintetico = false,
    public despesa: boolean = true,
    public despesa_analitico = true,
    public despesa_sintetico = false,
    public locacao: boolean = true,
    public agrupar_classe: boolean = true,
    public id_residuo: number = null,
    public datade: Date = null,
    public dataate: Date = null,
    public descricao: string = '',
    public id_manifesto: number = null,
    public manifesto: string = ''
  ) {}
}
