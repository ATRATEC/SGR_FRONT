export interface RelatorioFilter {
  id: string;
  descricao: string;
  tipo_atividade: string;
}
export class Relatorio {
  constructor(
    public id: number = null,
    public id_cliente: number = null,
    public cliente: string = '',
    public datade: Date = null,
    public dataate: Date = null,
    public descricao: string = '',
    public id_manifesto: number = null,
    public manifesto: string = '',
    public id_tipo_atividade: number = null,
    public created_at: string = '',
    public updated_at: string = '',
    public tipo_atividade: string = ''
  ) {}
}
