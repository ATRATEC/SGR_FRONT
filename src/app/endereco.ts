export class Estado {
  constructor(
    public id: number,
    public uf: string,
    public nome: string,
    public cod_ibge: string
  ) {}
}

export class Cidade {
  constructor(
    public id: number,
    public cCod: string,
    public cNome: string,
    public cUF: string,
    public nCodIBGE: string,
    public nCodSIAFI: string,
    public created_at: string,
    public updated_at: string
  ) {}
}
