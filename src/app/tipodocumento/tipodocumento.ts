export interface TipoDocumentoFilter {
  id: string;
  descricao: string;
}
export class TipoDocumento {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
