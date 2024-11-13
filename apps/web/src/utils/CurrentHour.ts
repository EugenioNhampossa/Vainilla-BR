export const currentHour = (data?: Date) => {
  var dataAtual = data || new Date();

  var horas = dataAtual.getHours() + '';
  var minutos = dataAtual.getMinutes() + '';

  if (dataAtual.getHours() < 10) {
    horas = '0' + horas;
  }

  if (dataAtual.getMinutes() < 10) {
    minutos = '0' + minutos;
  }

  return horas + ':' + minutos;
};
