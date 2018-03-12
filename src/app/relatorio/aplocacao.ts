export class ApLocacao {
  constructor(
    public coleta: Date,
    public equipamento: string = '',
    public quantidade: number,
    public unidade: string = '',
    public valor_unitario: number,
    public valor_total: number
  ) {}
}
