export class Receita {
  constructor(
    public coleta: Date,
    public manifesto: string = '',
    public id_cliente: number = null,
    public cliente: string = '',
    public residuo: string = '',
    public id_classe: number = null,
    public classe: string = '',
    public transportador: string = '',
    public destinador: string = '',
    public tratamento: string = '',
    public quantidade: number,
    public unidade: string = '',
    public valor_unitario: number,
    public valor_total: number
  ) {}
}
