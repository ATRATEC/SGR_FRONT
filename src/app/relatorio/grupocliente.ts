import { Despesa, DespesaAv } from './despesa';
import { Receita } from './receita';
export class GrupoCliente {
  constructor(
    public id_cliente: number = null,
    public cliente: string = '',
    public receitas: Receita[] = new Array<Receita>(),
    public despesas: Despesa[] = new Array<Despesa>(),
    public despesasav: DespesaAv[] = new Array<DespesaAv>(),
    public total_geral: number = null
  ) {}
}
