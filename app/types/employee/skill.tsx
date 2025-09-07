type Skill = {
  id: string
  name: string
  description?: string
  company?: string
}

type EmployeeSkill = {
  id?: string
  name: string
  description?: string
  skillId: string
  level: 'Beginner' | 'Intermediate' | 'Expert'
  acquiredAt?: Date | null
  employee?: string
  company?: string
}

export type { Skill, EmployeeSkill }
