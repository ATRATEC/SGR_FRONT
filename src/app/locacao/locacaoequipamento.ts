export interface LocacaoEquipamentoFilter {
  id: string;
  id_locacao: string;
  id_equipamento: string;
  unidade: string;
}
export class LocacaoEquipamento {
  constructor(
    public id: number = null,
    public id_locacao: number = null,
    public id_equipamento: number = null,
    public unidade: string = '',
    public quantidade: number = null,
    public created_at: string = '',
    public updated_at: string = '',
    public equipamento: string = ''
  ) {}
}
