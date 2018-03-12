export interface ResiduoFilter {
  id: string;
  descricao: string;
  classe_residuo: string;
  tipo_residuo: string;
  codigo_ibama: string;
}
export class Residuo {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public id_classe: number = null,
    public id_tipo_residuo: number = null,
    public codigo_nbr: string = '',
    public codigo_onu: string = '',
    public codigo_ibama: string = '',
    public created_at: string = '',
    public updated_at: string = '',
    public classe_residuo: string = '',
    public tipo_residuo: string = ''
  ) {}
}
