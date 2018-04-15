export class DespesaSintetica {
  constructor(
    public cnpj_cpf: string = '',
    public credor: string = '',
    public servico: string = '',
    public manifestos: string = '',
    public total: number
  ) {}
}
