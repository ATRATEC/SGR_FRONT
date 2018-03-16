import { Receita } from './receita';
export class GrupoCliente {
  constructor(
    public id_cliente: number = null,
    public cliente: string = '',
    public receitas: Receita[] = new Array<Receita>(),
    public total_geral: number = null
  ) {}
}
