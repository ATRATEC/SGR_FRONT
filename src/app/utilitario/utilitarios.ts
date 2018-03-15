export function strToBoolean(str: string): boolean {
  let retorno: boolean;
  switch (str) {
    case 'S':
      retorno = true;
      break;
    case 'N':
      retorno = false;
      break;
    case 'True':
      retorno = true;
      break;
    case 'False':
      retorno = false;
      break;
    case 'TRUE':
      retorno = true;
      break;
    case 'FALSE':
      retorno = false;
      break;
    default:
      retorno = false;
      break;
  }
  return retorno;
}

export function booleanToStrSN(bol: boolean): string {
  let retorno: string;
  if (bol) {
    retorno = 'S';
  } else {
    retorno = 'N';
  }
  return retorno;
}
