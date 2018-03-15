export interface FiltroPesagemFilter {
  id: string;
  descricao: string;
}
export class FiltroPesagem {
  constructor(
    public id: number = null,
    public id_cliente: number = null,
    public cliente: string = '',
    public id_residuo: number = null,
    public datade: Date = null,
    public dataate: Date = null,
    public descricao: string = ''
  ) {}
}
