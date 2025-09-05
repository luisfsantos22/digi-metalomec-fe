import moment from 'moment'

export function formatDate(date: Date) {
  moment.locale('pt')

  return moment(date).format('L')
}

export function translateEmployeeStatus(status: string) {
  switch (status) {
    case 'Contract with Right Term':
      return 'Contrato a Termo Certo'
    case 'Contract without Right Term':
      return 'Contrato a Termo Incerto'
    case 'Contract without Term':
      return 'Contrato sem Termo'
    case 'No Contract':
      return 'Sem Contrato'
    case 'On Leave':
      return 'Em licença'
    case 'Medical Leave':
      return 'Baixa Médica'
    case 'Contract Service Provider':
      return 'Contrato de Prestação de Serviços'
    default:
      return 'Desconhecido'
  }
}

export function translateEmployeeAvailabilityStatus(status: string) {
  switch (status) {
    case 'Available':
      return 'Disponível'
    case 'Not Available':
      return 'Indisponível'
    default:
      return 'Desconhecido'
  }
}
