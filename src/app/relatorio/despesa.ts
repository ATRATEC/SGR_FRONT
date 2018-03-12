export class Despesa {
  constructor(
    public coleta: Date,
    public manifesto: string = '',
    public residuo: string = '',
    public transportador: string = '',
    public destinador: string = '',
    public tratamento: string = '',
    public quantidade: number,
    public unidade: string = '',
    public valor_transporte: number,
    public valor_destinacao: number,
    public valor_total: number
  ) {}
}
