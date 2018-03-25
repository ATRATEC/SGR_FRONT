import { Despesa, DespesaAv, DespesaAvFor } from './despesa';
import { Receita } from './receita';
export class GrupoFornecedor {
  constructor(
    public id_fornecedor: number = null,
    public cnpj_cpf: string = '',
    public fornecedor: string = '',
    public receitas: Receita[] = new Array<Receita>(),
    public despesas: Despesa[] = new Array<Despesa>(),
    public despesasavfor: DespesaAvFor[] = new Array<DespesaAvFor>(),
    public total_geral: number = null
  ) {}
}
