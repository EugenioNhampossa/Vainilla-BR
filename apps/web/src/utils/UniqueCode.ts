export function gerarCodigoUnico() {
  const dataHora = new Date();

  const ano = dataHora.getFullYear();
  const mes = (dataHora.getMonth() + 1).toString().padStart(2, '0');
  const dia = dataHora.getDate().toString().padStart(2, '0');

  const horas = dataHora.getHours().toString().padStart(2, '0');
  const minutos = dataHora.getMinutes().toString().padStart(2, '0');
  const segundos = dataHora.getSeconds().toString().padStart(2, '0');

  const codigoUnico =
    ano.toString().slice(2) + mes + dia + horas + minutos + segundos;

  const codigoUnico5Digitos = codigoUnico.slice(-5);

  return codigoUnico5Digitos;
}
