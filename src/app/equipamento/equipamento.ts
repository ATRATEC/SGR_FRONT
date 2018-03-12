export interface EquipamentoFilter {
  id: string;
  descricao: string;
}
export class Equipamento {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
