import moment from 'moment'

export function formatDate(date: Date) {
  moment.locale('pt')

  return moment(date).format('L')
}

export function formatPhoneNumber(phoneNumber: string) {
  // remover prefixo internacional (+351)
  if (phoneNumber && phoneNumber.startsWith('+351')) {
    phoneNumber = phoneNumber.slice(4)

    // adicionar espaço de 3 em 3 dígitos
    phoneNumber = phoneNumber.replace(/(\d{3})(?=\d)/g, '$1 ')
  }

  return phoneNumber
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

export function translateSkillLevel(level: string) {
  switch (level) {
    case 'Beginner':
      return 'Iniciante'
    case 'Intermediate':
      return 'Intermediário'
    case 'Advanced':
      return 'Avançado'
    default:
      return 'Desconhecido'
  }
}
