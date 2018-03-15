export class RelatorioPesagem {
  constructor(
    public coleta: Date,
    public id_cliente: number,
    public cliente: string = '',
    public residuo: string = '',
    public unidade: string = '',
    public peso: number
  ) {}
}
