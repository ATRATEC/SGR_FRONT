import { GrupoCliente } from './grupocliente';
export class GrupoClasse {
  constructor(
    public id_classe: number = null,
    public classe: string = '',
    public grupo_clientes: GrupoCliente[] = new Array<GrupoCliente>(),
    public total_geral: number = null
  ) {}
}
