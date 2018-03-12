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
    public receita: boolean = true,
    public despesa: boolean = true,
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
