import { Moment } from 'moment/moment';

export interface FornecedorDocumentoFilter {
  id: string;
  descricao: string;
  razao_social: string;
  numero: string;
}
export class FornecedorDocumento {
  constructor(
    public id: number = null,
    public id_tipo_documento: number = null,
    public numero: string = '',
    public emissao: Date = null,
    public vencimento: Date = null,
    public caminho: string = '',
    public created_at: string = '',
    public updated_at: string = '',
    public descricao: string = '',
    public razao_social: string = '',
    public id_fornecedor: number = null
  ) {}
}
