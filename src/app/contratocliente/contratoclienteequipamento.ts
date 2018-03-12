export interface ContratoClienteEquipamentoFilter {
  id: string;
  cliente: string;
  equipamento: string;  
}
export class ContratoClienteEquipamento {
  constructor(
    public id: number = null,
    public id_contrato_cliente: number = null,
    public id_equipamento: number = null,    
    public unidade: string = '',
    public preco: number = 0,
    public created_at: string = '',
    public updated_at: string = '',
    public equipamento: string = ''    
  ) {}
}
