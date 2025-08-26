export const SKILL_LEVELS = [
  { key: 'Beginner', label: 'Iniciante' },
  { key: 'Intermediate', label: 'Intermédio' },
  { key: 'Expert', label: 'Especialista' },
] as const

export const CAROUSEL_TEXT_LIST = [
  'Tenha uma visão completa do seu negócio e total gestão sobre as suas operações.',
  'Trabalhamos para a excelência do seu negócio. Oferecemos uma plataforma completa, intuitiva e fácil de usar.',
  'Acompanhamento constante das suas necessidades. Exatidão em toda a linha.',
]

export const AVAILABLE_ROLES = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'EMPLOYEE', label: 'Colaborador' },
  { value: 'MANAGER', label: 'Gestor' },
]

export const AVAILABILITY_STATUS = [
  { value: 'Available', label: 'Disponível' },
  { value: 'Unavailable', label: 'Indisponível' },
]

export const EMPLOYEE_STATUS = [
  { value: 'Contract_With_Right_Term', label: 'Contrato a Termo Certo' },
  { value: 'Contract_Without_Right_Term', label: 'Contrato a Termo Incerto' },
  { value: 'Contract_Without_Term', label: 'Contrato Sem Termo' },
  { value: 'No_Contract', label: 'Sem Contrato' },
  { value: 'On_Leave', label: 'Em Licença' },
  { value: 'Medical_Leave', label: 'Licença Médica' },
  { value: 'Contract_Service_Provider', label: 'Prestador de Serviços' },
]

export const NEW_EMPLOYEE_STEPS = [
  'Informação Geral',
  'Informação Colaborador',
  'Informação Técnica',
]

export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Masculino' },
  { value: 'Female', label: 'Feminino' },
  { value: 'Other', label: 'Outro' },
]

export const MARITAL_STATUS_OPTIONS = [
  { value: 'Single', label: 'Solteiro(a)' },
  { value: 'Married', label: 'Casado(a)' },
  { value: 'Divorced', label: 'Divorciado(a)' },
  { value: 'Widowed', label: 'Viúvo(a)' },
  { value: 'Separated', label: 'Separado(a)' },
]

export const YES_NO_OPTIONS = [
  { value: true, label: 'Sim' },
  { value: false, label: 'Não' },
]

export const CERTIFICATION_TABLE_LIST = [
  'Nome',
  'Emissor',
  'Validade (dias)',
  'Ações',
]

export const EMPLOYEE_DETAILS_TABS = [
  { label: 'Geral', value: 'general', disabled: false },
  { label: 'Contrato', value: 'contract', disabled: true },
  { label: 'Certificações', value: 'certifications', disabled: true },
  { label: 'Performance', value: 'performance', disabled: true },
  { label: 'Documentos', value: 'documents', disabled: true },
]
