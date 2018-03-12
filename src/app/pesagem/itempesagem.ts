export interface ItemPesagemFilter {
  id: string;
  id_pesagem: string;
  id_residuo: string;
  unidade: string;
}
export class ItemPesagem {
  constructor(
    public id: number = null,
    public id_pesagem: number = null,
    public id_residuo: number = null,
    public unidade: string = '',
    public peso: number = null,
    public created_at: string = '',
    public updated_at: string = '',
    public residuo: string = ''
  ) {}
}
