import { GrupoFornecedor } from './grupofornecedor';
import { GrupoCliente } from './grupocliente';
export class GrupoClasse {
  constructor(
    public id_classe: number = null,
    public classe: string = '',
    public grupo_clientes: GrupoCliente[] = new Array<GrupoCliente>(),
    public grupo_fornecedores: GrupoFornecedor[] = new Array<GrupoFornecedor>(),
    public total_geral: number = null
  ) {}
}
