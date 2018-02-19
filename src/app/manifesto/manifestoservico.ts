export interface ManifestoServicoFilter {
  id: string;
  id_manifesto: string;
  id_residuo: string;
  id_tipo_residuo: string;
  id_acondicionamento: string;
  id_tratamento: string;
  unidade: string;
}
export class ManifestoServico {
  constructor(
    public id: number = null,
    public id_manifesto: number = null,
    public id_residuo: number = null,
    public id_tipo_residuo: number = null,
    public id_acondicionamento: number = null,
    public id_tratamento: number = null,
    public unidade: string = '',
    public quantidade: number = null,
    public quantidade_final: number = null,
    public created_at: string = '',
    public updated_at: string = '',
    public residuo: string = '',
    public tipo_residuo: string = '',
    public acondicionamento: string = '',
    public tratamento: string = '',
  ) {}
}
