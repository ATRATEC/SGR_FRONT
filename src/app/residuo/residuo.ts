export interface ResiduoFilter {
  id: string;
  descricao: string;
  classe_residuo: string;
  tipo_residuo: string;
  acondicionamento: string;
  tratamento: string;
}
export class Residuo {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public id_classe: number = null,
    public id_tipo_residuo: number = null,
    public id_acondicionamento: number = null,
    public id_tratamento: number = null,
    public descricao_classe: string = '',
    public created_at: string = '',
    public updated_at: string = '',
    public classe_residuo: string = '',
    public tipo_residuo: string = '',
    public acondicionamento: string = '',
    public tratamento: string = ''
  ) {}
}
