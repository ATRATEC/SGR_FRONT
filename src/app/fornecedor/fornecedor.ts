import { FornecedorFilter } from './fornecedor';
import { Data } from '@angular/router';
export interface FornecedorFilter {
  id: string;
  codigo_omie: string;
  cnpj_cpf: string;
  razao_social: string;
  contato: string;
  telefone: string;
  email: string;
  inativo: boolean;
}
export class FornecedorFiltro implements FornecedorFilter {
  constructor(
    public id: string = '',
    public codigo_omie: string = '',
    public cnpj_cpf: string = '',
    public razao_social: string = '',
    public contato: string = '',
    public telefone: string = '',
    public email: string = '',
    public inativo: boolean = false
  ) {}
}
export class Fornecedor {
  constructor(
    public id: number = null,
    public codigo_omie: number = null,
    public codigo_integracao: string = '',
    public cnpj_cpf: string = '',
    public razao_social: string = '',
    public nome_fantasia: string = '',
    public logradouro: string = '',
    public endereco: string = '',
    public endereco_numero: string = '',
    public complemento: string = '',
    public bairro: string = '',
    public cidade: string = '',
    public estado: string = '',
    public cep: string = '',
    public codigo_pais: string = '',
    public nascimento: string = '',
    public contato: string = '',
    public telefone1_ddd: string = '',
    public telefone1_numero: string = '',
    public telefone2_ddd: string = '',
    public telefone2_numero: string = '',
    public fax_ddd: string = '',
    public fax_numero: string = '',
    public email: string = '',
    public homepage: string = '',
    public observacao: string = '',
    public inscricao_municipal: string = '',
    public inscricao_estadual: string = '',
    public inscricao_suframa: string = '',
    public pessoa_fisica: string = '',
    public optante_simples_nacional: string = '',
    public bloqueado: string = '',
    public importado_api: string = '',
    public cnae: string = '',
    public obsEndereco: string = '',
    public obsTelefonesEmail: string = '',
    public inativo: string = 'N',
    public inclusao: Date = null,
    public usuario_inclusao: string = '',
    public alteracao: Date = null,
    public usuario_alteracao: string = '',
    public sincronizar: string = '',
    public id_empresa: number = null,
    public id_filial: number = null,
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
