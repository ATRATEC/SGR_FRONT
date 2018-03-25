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

export class DespesaAv {
  constructor(
    public coleta: Date,
    public manifesto: string = '',
    public id_cliente: number,
    public cliente: string = '',
    public residuo: string = '',
    public transportador: string = '',
    public destinador: string = '',
    public quantidade: number,
    public unidade: string = '',
    public valor_unitario: number,
    public valor_total: number
  ) {}
}

export class DespesaAvFor {
  constructor(
    public coleta: Date,
    public manifesto: string = '',
    public id_fornecedor: number,
    public cnpj_cpf: string = '',
    public fornecedor: string = '',
    public residuo: string = '',
    public id_classe: number,
    public classe: string = '',
    public id_servico: number,
    public servico: string = '',
    public quantidade: number,
    public unidade: string = '',
    public valor_unitario: number,
    public valor_total: number
  ) {}
}
